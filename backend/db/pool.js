const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("error", (err) => {
  console.error("Erro no pool PostgreSQL:", err);
});

pool.query("SELECT NOW()")
  .then(() => console.log("Banco conectado com sucesso"))
  .catch(err => console.error("ERRO AO CONECTAR NO BANCO:", err));

module.exports = pool;