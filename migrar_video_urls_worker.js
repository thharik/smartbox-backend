require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Troque se o nome do seu worker for diferente
const DE   = "https://smartbox-backend.onrender.com/video/";
const PARA = "https://tvxbox-b2.tharikluan-miguel.workers.dev/";

async function migrar() {
  try {
    const preview = await pool.query(
      `SELECT id, video_url FROM episodios WHERE video_url LIKE $1 LIMIT 5`,
      [`${DE}%`]
    );
    console.log("🔎 Exemplo de URLs que serão trocadas (até 5):");
    console.table(preview.rows);

    const contagem = await pool.query(
      `SELECT COUNT(*) FROM episodios WHERE video_url LIKE $1`,
      [`${DE}%`]
    );
    console.log(`📊 Total de vídeos afetados: ${contagem.rows[0].count}`);

    const resultado = await pool.query(
      `UPDATE episodios
       SET video_url = REPLACE(video_url, $1, $2)
       WHERE video_url LIKE $3`,
      [DE, PARA, `${DE}%`]
    );

    console.log(`✅ ${resultado.rowCount} URLs atualizadas com sucesso.`);

    const depois = await pool.query(
      `SELECT id, video_url FROM episodios WHERE video_url LIKE $1 LIMIT 5`,
      [`${PARA}%`]
    );
    console.log("📋 Exemplo de como ficaram (até 5):");
    console.table(depois.rows);
  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await pool.end();
  }
}

migrar();
