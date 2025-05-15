require('dotenv').config();
const { Pool } = require('pg');

// Cria o pool de conexões com base na URL do .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // necessário para Render e outros serviços com SSL
  }
});

// Teste de conexão
pool.connect()
  .then(() => {
    console.log('Conectado ao banco de dados PostgreSQL');
    return pool.end();
  })
  .catch((err) => {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  });

module.exports = pool;
