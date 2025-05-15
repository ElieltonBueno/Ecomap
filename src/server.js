require('dotenv').config();
const express = require('express');
const server = express();

// Conexão com PostgreSQL
const pool = require('./database/db');

// Configurar pasta pública
server.use(express.static('public'));

// Habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }));

// Configurar Nunjucks
const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
  express: server,
  noCache: true,
});

// Rota principal
server.get('/', (req, res) => {
  return res.render('index.html');
});

// Rota de cadastro
server.get('/cadastroponto', (req, res) => {
  return res.render('create-point.html');
});

// Salvar ponto no banco PostgreSQL
server.post('/savepoint', async (req, res) => {
  const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items,
      lat,
      lng
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id;
  `;

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
    req.body.lat,
    req.body.lng,
  ];

  try {
    const result = await pool.query(query, values);
    console.log('Cadastrado com sucesso, ID:', result.rows[0].id);
    return res.render('create-point.html', { saved: true });
  } catch (err) {
    console.error('Erro ao inserir dados:', err);
    return res.status(500).render('create-point.html', { error: 'Erro ao salvar ponto' });
  }
});

// Rota de busca
server.get('/busca', async (req, res) => {
  const search = req.query.city;

  if (!search) {
    return res.render('search-results.html', { results: [] });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM places WHERE city ILIKE $1`,
      [`%${search}%`]
    );
    return res.render('search-results.html', { results: result.rows });
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    return res.status(500).render('search-results.html', { error: 'Erro na busca' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
