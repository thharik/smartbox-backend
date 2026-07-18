-- ── Patch: tabela de assinaturas ──────────────────────────────────────────────
-- Execute no banco com: psql $DATABASE_URL -f schema_assinatura_patch.sql

CREATE TABLE IF NOT EXISTS assinaturas (
  usuario_id              UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT,  -- legado (Stripe, descontinuado)
  stripe_customer_id      TEXT,  -- legado (Stripe, descontinuado)
  mp_payment_id           TEXT,  -- id do pagamento Pix mais recente no Mercado Pago
  status                  TEXT NOT NULL DEFAULT 'inativa',  -- 'ativa' | 'inativa'
  valida_ate              TIMESTAMPTZ,
  criado_em               TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em           TIMESTAMPTZ DEFAULT NOW()
);

-- Garante a coluna mesmo se a tabela já existia antes deste patch
ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS mp_payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_assinaturas_status   ON assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_customer ON assinaturas(stripe_customer_id);