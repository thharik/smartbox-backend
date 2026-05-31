const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

// ───────────────── REGISTER ─────────────────
router.post("/register", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha || senha.length < 6) {
    return res.status(400).json({
      mensagem: "E-mail e senha (mín. 6 caracteres) obrigatórios"
    });
  }

  try {
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE email=$1",
      [email]
    );

    if (existe.rows.length) {
      return res.status(409).json({
        mensagem: "E-mail já cadastrado"
      });
    }

    const hash = await bcrypt.hash(senha, 12);

    const { rows } = await pool.query(
      "INSERT INTO usuarios (email, senha_hash) VALUES ($1, $2) RETURNING id",
      [email, hash]
    );

    // Cria perfil padrão
    await pool.query(
      "INSERT INTO perfis (usuario_id, nome, avatar) VALUES ($1, $2, 'avatar1')",
      [rows[0].id, email.split("@")[0]]
    );

    return res.status(201).json({
      mensagem: "Conta criada com sucesso"
    });

  } catch (err) {
    console.error("REGISTER ERROR:");
    console.error(err);

    return res.status(500).json({
      erro: err.message
    });
  }
});

// ───────────────── LOGIN ─────────────────
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT id, email, senha_hash FROM usuarios WHERE email=$1",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos"
      });
    }

    const ok = await bcrypt.compare(
      senha,
      rows[0].senha_hash
    );

    if (!ok) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    const token = jwt.sign(
      {
        id: rows[0].id,
        email: rows[0].email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );

    return res.json({
      token,
      email: rows[0].email,
      id: rows[0].id
    });

  } catch (err) {
    console.error("LOGIN ERROR:");
    console.error(err);

    return res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;