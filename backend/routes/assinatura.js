// ─── GET /assinatura/status ───────────────────────────────────────────────
router.get("/status", authMiddleware, async (req, res) => {
  try {

    // Primeiro verifica se a conta é isenta
    const { rows: usuarioRows } = await pool.query(
      "SELECT isento_pagamento FROM usuarios WHERE id=$1",
      [req.usuario.id]
    );

    if (!usuarioRows.length) {
      return res.status(404).json({
        ativa: false,
        status: "usuario_nao_encontrado"
      });
    }

    // Contas isentas sempre possuem acesso
    if (usuarioRows[0].isento_pagamento === true) {
      return res.json({
        ativa: true,
        status: "isenta",
        isento_pagamento: true,
        valida_ate: null
      });
    }

    // Verifica assinatura paga
    const { rows } = await pool.query(
      "SELECT status, valida_ate FROM assinaturas WHERE usuario_id=$1",
      [req.usuario.id]
    );

    if (!rows.length) {
      return res.json({
        ativa: false,
        status: "inativa",
        isento_pagamento: false
      });
    }

    const assinatura = rows[0];

    const ativa =
      assinatura.status === "ativa" &&
      assinatura.valida_ate &&
      new Date(assinatura.valida_ate) > new Date();

    return res.json({
      ativa,
      status: ativa ? "ativa" : "inativa",
      isento_pagamento: false,
      valida_ate: assinatura.valida_ate
    });

  } catch (err) {
    console.error("Erro ao verificar assinatura:", err);

    return res.status(500).json({
      mensagem: "Erro ao verificar assinatura."
    });
  }
});