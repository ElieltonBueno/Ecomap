const { Pool } = require('pg')

// Usa a variável de ambiente DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário no Render
  }
})

// Criar a tabela se não existir
async function initDB() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS places (
      id SERIAL PRIMARY KEY,
      image TEXT,
      name TEXT,
      address TEXT,
      address2 TEXT,
      state TEXT,
      city TEXT,
      items TEXT,
      lat TEXT,
      lng TEXT
    )
  `
  try {
    await pool.query(createTableQuery)
    console.log("Tabela 'places' criada com sucesso.")
  } catch (err) {
    console.error('Erro ao criar tabela:', err); // Mostra o erro detalhado
  }
}

// Executa ao importar
initDB()

module.exports = pool
