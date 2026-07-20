const router = require("express").Router();
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { authMiddleware } = require("../middleware/auth");

// Listar perfis
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         id,
         nome,
         avatar,
         infantil,
         (pin_hash IS NOT NULL) AS tem_pin
       FROM perfis
       WHERE usuario_id = $1
       ORDER BY criado_em`,
      [req.usuario.id]
    );

    res.json(rows);
  } catch (erro) {
    console.error("Erro ao listar perfis:", erro);

    res.status(500).json({
      mensagem: "Erro ao listar perfis"
    });
  }
});

// Criar perfil
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      nome,
      avatar = "avatar1",
      infantil = false,
      pin
    } = req.body;

    if (!nome || !String(nome).trim()) {
      return res.status(400).json({
        mensagem: "Nome obrigatório"
      });
    }

    const { rows: existentes } = await pool.query(
      `SELECT id
       FROM perfis
       WHERE usuario_id = $1`,
      [req.usuario.id]
    );

    if (existentes.length >= 4) {
      return res.status(400).json({
        mensagem: "Máximo de 4 perfis atingido"
      });
    }

    const pinHash = pin
      ? await bcrypt.hash(String(pin), 10)
      : null;

    const { rows } = await pool.query(
      `INSERT INTO perfis (
         usuario_id,
         nome,
         avatar,
         infantil,
         pin_hash
       )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING
         id,
         nome,
         avatar,
         infantil,
         (pin_hash IS NOT NULL) AS tem_pin`,
      [
        req.usuario.id,
        String(nome).trim(),
        avatar,
        infantil,
        pinHash
      ]
    );

    res.status(201).json(rows[0]);
  } catch (erro) {
    console.error("Erro ao criar perfil:", erro);

    res.status(500).json({
      mensagem: "Erro ao criar perfil"
    });
  }
});

// Editar perfil
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { nome, avatar, infantil, pin } = req.body;

    const campos = [];
    const valores = [];
    let indice = 1;

    if (nome !== undefined) {
      if (!String(nome).trim()) {
        return res.status(400).json({
          mensagem: "O nome do perfil não pode ficar vazio"
        });
      }

      campos.push(`nome = $${indice++}`);
      valores.push(String(nome).trim());
    }

    if (avatar !== undefined) {
      campos.push(`avatar = $${indice++}`);
      valores.push(avatar);
    }

    if (infantil !== undefined) {
      campos.push(`infantil = $${indice++}`);
      valores.push(infantil);
    }

    if (pin !== undefined) {
      const pinHash = pin
        ? await bcrypt.hash(String(pin), 10)
        : null;

      campos.push(`pin_hash = $${indice++}`);
      valores.push(pinHash);
    }

    if (campos.length === 0) {
      return res.status(400).json({
        mensagem: "Nada para atualizar"
      });
    }

    const indicePerfil = indice++;
    valores.push(req.params.id);

    const indiceUsuario = indice;
    valores.push(req.usuario.id);

    const { rows } = await pool.query(
      `UPDATE perfis
       SET ${campos.join(", ")}
       WHERE id = $${indicePerfil}
         AND usuario_id = $${indiceUsuario}
       RETURNING
         id,
         nome,
         avatar,
         infantil,
         (pin_hash IS NOT NULL) AS tem_pin`,
      valores
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: "Perfil não encontrado"
      });
    }

    res.json(rows[0]);
  } catch (erro) {
    console.error("Erro ao editar perfil:", erro);

    res.status(500).json({
      mensagem: "Erro ao editar perfil"
    });
  }
});

// Deletar perfil
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { rows: perfis } = await pool.query(
      `SELECT id
       FROM perfis
       WHERE usuario_id = $1`,
      [req.usuario.id]
    );

    if (perfis.length <= 1) {
      return res.status(400).json({
        mensagem: "Não é possível apagar o único perfil"
      });
    }

    const { rows } = await pool.query(
      `DELETE FROM perfis
       WHERE id = $1
         AND usuario_id = $2
       RETURNING id`,
      [req.params.id, req.usuario.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: "Perfil não encontrado"
      });
    }

    res.json({
      mensagem: "Perfil removido"
    });
  } catch (erro) {
    console.error("Erro ao remover perfil:", erro);

    res.status(500).json({
      mensagem: "Erro ao remover perfil"
    });
  }
});

// Verificar PIN
router.post("/:id/pin", authMiddleware, async (req, res) => {
  try {
    const { pin } = req.body;

    const { rows } = await pool.query(
      `SELECT pin_hash
       FROM perfis
       WHERE id = $1
         AND usuario_id = $2`,
      [req.params.id, req.usuario.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        mensagem: "Perfil não encontrado"
      });
    }

    if (!rows[0].pin_hash) {
      return res.json({
        ok: true
      });
    }

    if (pin === undefined || pin === null || pin === "") {
      return res.status(400).json({
        mensagem: "Informe o PIN"
      });
    }

    const pinCorreto = await bcrypt.compare(
      String(pin),
      rows[0].pin_hash
    );

    if (!pinCorreto) {
      return res.status(401).json({
        mensagem: "PIN incorreto"
      });
    }

    res.json({
      ok: true
    });
  } catch (erro) {
    console.error("Erro ao verificar PIN:", erro);

    res.status(500).json({
      mensagem: "Erro ao verificar PIN"
    });
  }
});

module.exports = router;