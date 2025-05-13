// importar a dependência do sqlite3
const sqlite3 = require('sqlite3').verbose();

// criar o objeto que irá fazer operações no banco de dados
const db = new sqlite3.Database('./src/database/database.db', (err) => {
  if (err) {
    return console.error('Erro ao conectar no banco de dados:', err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

// Criar a tabela 'places' se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela places criada ou já existe');
    }
  });
});

// exportar o banco de dados
module.exports = db;