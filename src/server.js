const express = require('express');
const server = express();

// Pegar o banco de dados
const db = require('./database/db');

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

// Configurar rotas
server.get('/', (req, res) => {
  return res.render('index.html');
});

server.get('/cadastroponto', (req, res) => {
  return res.render('create-point.html');
});

server.post('/savepoint', (req, res) => {
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
    ) VALUES (?,?,?,?,?,?,?,?,?);
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

  function afterInsertData(err) {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).render('create-point.html', { error: 'Erro ao salvar ponto' });
    }
    console.log('Cadastrado com sucesso');
    console.log(this);
    return res.render('create-point.html', { saved: true });
  }

  db.run(query, values, afterInsertData);
});

server.get('/busca', (req, res) => {
  const search = req.query.city;

  if (!search) {
    return res.render('search-results.html', { results: [] });
  }

  db.all(`SELECT * FROM places WHERE city LIKE ?`, [`%${search}%`], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).render('search-results.html', { error: 'Erro na busca' });
    }
    console.log('Registros encontrados:', rows);
    return res.render('search-results.html', { results: rows });
  });
});

// Ligar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});