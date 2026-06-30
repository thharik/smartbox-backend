const { Pool } = require("pg");

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 5,                  // máximo de conexões simultâneas
        idleTimeoutMillis: 30000, // fecha conexão ociosa após 30s
        connectionTimeoutMillis: 10000, // timeout de 10s para conectar
      }
    : {
        host:     process.env.DB_HOST,
        port:     Number(process.env.DB_PORT) || 5432,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
             rejectUnauthorized: false
        },
      }
);

pool.on("error", (err) => {
  // ECONNRESET é normal no Render (banco dorme) — ignora silenciosamente
  if (err.code !== "ECONNRESET") {
    console.error("Erro no pool PostgreSQL:", err.message);
  }
});

// Testa conexão com retry (Render pode demorar para acordar)
async function testarConexao(tentativas = 3) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      await pool.query("SELECT NOW()");
      console.log("✅ Banco conectado com sucesso");
      return;
    } catch (err) {
      console.warn(`⚠️  Tentativa ${i}/${tentativas} falhou: ${err.message}`);
      if (i < tentativas) await new Promise(r => setTimeout(r, 3000)); // espera 3s
    }
  }
  console.error("❌ Não foi possível conectar ao banco. O servidor continua rodando e tentará reconectar nas próximas requisições.");
}

testarConexao();

module.exports = pool;