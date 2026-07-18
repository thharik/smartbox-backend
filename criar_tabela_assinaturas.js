require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function criarTabela() {
  try {
    console.log("🔧 Criando tabela 'assinaturas' (se ainda não existir)...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assinaturas (
        id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        usuario_id              UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
        stripe_subscription_id  TEXT,
        stripe_customer_id      TEXT,
        status                  TEXT NOT NULL DEFAULT 'inativa',
        valida_ate              TIMESTAMPTZ,
        criado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        atualizado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log("✅ Tabela 'assinaturas' criada (ou já existia).");

    // Índice extra pra buscas por customer_id (usado no webhook quando não vem usuario_id no metadata)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_assinaturas_customer
      ON assinaturas (stripe_customer_id);
    `);

    console.log("✅ Índice em stripe_customer_id conferido.");

    const conferir = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'assinaturas'
      ORDER BY ordinal_position;
    `);

    console.log("📋 Estrutura final da tabela 'assinaturas':");
    console.table(conferir.rows);
  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await pool.end();
  }
}

criarTabela();
