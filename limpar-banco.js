require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

async function limpar() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("🗑️  Limpando banco...");

    await client.query("DELETE FROM progresso");
    console.log("✅ progresso apagado");

    await client.query("DELETE FROM progresso_manga");
    console.log("✅ progresso_manga apagado");

    await client.query("DELETE FROM favoritos");
    console.log("✅ favoritos apagado");

    await client.query("DELETE FROM episodios");
    console.log("✅ episodios apagado");

    await client.query("DELETE FROM temporadas");
    console.log("✅ temporadas apagado");

    await client.query("DELETE FROM capitulos");
    console.log("✅ capitulos apagado");

    await client.query("DELETE FROM conteudos");
    console.log("✅ conteudos apagado");

    await client.query("COMMIT");
    console.log("🎉 Banco limpo com sucesso! Agora rode: node cadastrar-conteudo.js");
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("❌ Erro:", erro.message);
  } finally {
    client.release();
    await pool.end();
  }
}

limpar();
