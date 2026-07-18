require("dotenv").config();
const { Pool } = require("pg");

// Troque pelo e-mail que você usa pra logar no TVXBOX:
const SEU_EMAIL = "tharikluan.miguel@rede.ulbra.br";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function verificarTudo() {
  try {
    console.log("\n📋 Todas as tabelas do banco:");
    const tabelas = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.table(tabelas.rows);

    console.log("\n📋 Colunas da tabela usuarios:");
    const colunasUsuarios = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'usuarios';
    `);
    console.table(colunasUsuarios.rows);

    console.log("\n📋 Colunas da tabela assinaturas:");
    const colunasAssinaturas = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'assinaturas';
    `);
    if (colunasAssinaturas.rows.length === 0) {
      console.log("⚠️  A tabela 'assinaturas' não existe (ou não tem colunas visíveis)!");
    } else {
      console.table(colunasAssinaturas.rows);
    }

    console.log(`\n🔎 Estado da conta "${SEU_EMAIL}":`);
    const conta = await pool.query(
      `
      SELECT u.id, u.email, u.isento_pagamento, a.status, a.valida_ate
      FROM usuarios u
      LEFT JOIN assinaturas a ON a.usuario_id = u.id
      WHERE u.email = $1;
      `,
      [SEU_EMAIL]
    );

    if (conta.rows.length === 0) {
      console.log(`⚠️  Nenhum usuário encontrado com o e-mail "${SEU_EMAIL}". Confira se está certo.`);
    } else {
      console.table(conta.rows);
    }
  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await pool.end();
  }
}

verificarTudo();
