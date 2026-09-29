const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não foi encontrada no ambiente.");
  throw new Error("DATABASE_URL não configurada");
}

// Mostra somente o host, sem revelar usuário, senha ou URL completa
let dbHost = "";

try {
  const parsed = new URL(process.env.DATABASE_URL);
  dbHost = parsed.hostname;

  console.log("======================================");
  console.log("🔎 DATABASE_URL encontrada");
  console.log("🔎 Host PostgreSQL em uso:", dbHost);
  console.log("======================================");
} catch (err) {
  console.error("❌ DATABASE_URL está em formato inválido.");
  throw err;
}

// Proteção temporária para detectar o banco antigo
if (dbHost === "dpg-d9plpvnlk1mc73ecipg0-a") {
  console.error("❌ ERRO: O Render ainda está fornecendo o HOST ANTIGO!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  if (err.code !== "ECONNRESET") {
    console.error("❌ Erro no pool PostgreSQL:", err.message);
  }
});

async function testarConexao(tentativas = 3) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resultado = await pool.query(
        "SELECT NOW() AS agora, current_database() AS banco"
      );

      console.log("✅ Banco conectado com sucesso");
      console.log("✅ Database:", resultado.rows[0].banco);
      return;
    } catch (err) {
      console.warn(
        `⚠️ Tentativa ${i}/${tentativas} falhou: ${err.message}`
      );

      if (i < tentativas) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  console.error("❌ Não foi possível conectar ao PostgreSQL.");
}

testarConexao();

module.exports = pool;