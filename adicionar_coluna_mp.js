require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrar() {
  try {
    console.log("🔧 Adicionando coluna 'mp_payment_id' na tabela assinaturas...");

    await pool.query(`
      ALTER TABLE assinaturas
      ADD COLUMN IF NOT EXISTS mp_payment_id TEXT;
    `);

    console.log("✅ Coluna adicionada (ou já existia).");

    const conferir = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'assinaturas'
      ORDER BY ordinal_position;
    `);

    console.log("📋 Estrutura atual da tabela 'assinaturas':");
    console.table(conferir.rows);
  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await pool.end();
  }
}

migrar();
