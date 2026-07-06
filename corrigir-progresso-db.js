require("dotenv").config();
const { Pool } = require("pg");

const usarSSL =
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes("render.com");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: usarSSL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 15000,
});

async function corrigir() {
  try {
    console.log("🔧 Corrigindo tabela progresso...");

    await pool.query(`
      ALTER TABLE progresso
        ADD COLUMN IF NOT EXISTS titulo TEXT DEFAULT '',
        ADD COLUMN IF NOT EXISTS ep_titulo TEXT DEFAULT '',
        ADD COLUMN IF NOT EXISTS poster TEXT DEFAULT '',
        ADD COLUMN IF NOT EXISTS capa TEXT DEFAULT '';
    `);

    console.log("✅ Tabela progresso corrigida com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao corrigir tabela progresso:", err.message);
  } finally {
    await pool.end();
  }
}

corrigir();