require("dotenv").config();
const { Pool } = require("pg");

const usarSSL =
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes("render.com");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: usarSSL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 15000,
});

async function liberarConta() {
  const email = "tharikluan.miguel@rede.ulbra.br"; // troque se seu login no site for outro e-mail

  try {
    console.log("🔧 Criando coluna isento_pagamento, se ainda não existir...");

    await pool.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS isento_pagamento BOOLEAN DEFAULT false;
    `);

    console.log("✅ Coluna conferida/criada.");

    console.log("🔓 Liberando sua conta do pagamento...");

    const result = await pool.query(
      `
      UPDATE usuarios
      SET isento_pagamento = true
      WHERE email = $1;
      `,
      [email]
    );

    console.log(`✅ Linhas atualizadas: ${result.rowCount}`);

    const conferir = await pool.query(
      `
      SELECT email, isento_pagamento
      FROM usuarios
      WHERE email = $1;
      `,
      [email]
    );

    console.log("📌 Resultado:");
    console.table(conferir.rows);
  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await pool.end();
  }
}

liberarConta();
