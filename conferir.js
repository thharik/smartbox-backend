require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function conferir() {
  try {
    console.log("📋 Colunas da tabela usuarios:");
    const usuarios = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'usuarios';
    `);
    console.table(usuarios.rows);

    console.log("📋 Colunas da tabela assinaturas:");
    const assinaturas = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'assinaturas';
    `);
    console.table(assinaturas.rows);

    if (assinaturas.rows.length === 0) {
      console.log("⚠️  A tabela 'assinaturas' não existe ou não tem colunas visíveis.");
    }
  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await pool.end();
  }
}

conferir();
