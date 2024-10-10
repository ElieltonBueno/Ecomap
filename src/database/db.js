// importar a dependência do sqlite3
const sqlite3 = require("sqlite3").verbose();

// criar o objeto que irá fazer operações no banco de dados
const db = new sqlite3.Database("./src/database/database.db", (err) => {
  if (err) {
    return console.error("Erro ao conectar no banco de dados:", err.message);
  }
  console.log("Conectado ao banco de dados SQLite.");
});

// exportar o banco de dados
module.exports = db;
