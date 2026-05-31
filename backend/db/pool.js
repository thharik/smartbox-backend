require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("Erro no pool PostgreSQL:", err);
});

pool.query("SELECT NOW()")
  .then(() => console.log("Banco conectado com sucesso"))
  .catch(err => console.error("ERRO AO CONECTAR NO BANCO:", err));

module.exports = pool;