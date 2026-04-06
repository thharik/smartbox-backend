-- ── Patch: tabela de assinaturas ──────────────────────────────────────────────
-- Execute no banco com: psql $DATABASE_URL -f schema_assinatura_patch.sql

CREATE TABLE IF NOT EXISTS assinaturas (
  usuario_id              UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT,
  stripe_customer_id      TEXT,
  status                  TEXT NOT NULL DEFAULT 'inativa',  -- 'ativa' | 'inativa'
  valida_ate              TIMESTAMPTZ,
  criado_em               TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_customer ON assinaturas(stripe_customer_id);