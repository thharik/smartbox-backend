/**
 * backend/routes/auth.js — autenticação segura
 *
 * USA APENAS O QUE JÁ ESTÁ NO package.json:
 *   bcryptjs, jsonwebtoken, pg, express
 *
 * NÃO precisa instalar nada novo.
 * Coloque este arquivo em: backend/routes/auth.js
 */

const express = require("express");
const bcrypt  = require("bcryptjs");   // já instalado (bcryptjs, não bcrypt)
const jwt     = require("jsonwebtoken");
const router  = express.Router();
const pool    = require("../db/pool");

// ─── Rate limit manual (sem dependência extra) ────────────────────────────────
const tentativasLogin = new Map();
const JANELA_MS   = 15 * 60 * 1000; // 15 minutos
const MAX_TENTS   = 10;              // máximo de tentativas por IP

function verificarRateLimit(ip) {
  const agora = Date.now();
  const dados = tentativasLogin.get(ip);

  if (!dados || agora - dados.desde > JANELA_MS) {
    tentativasLogin.set(ip, { count: 1, desde: agora });
    return { bloqueado: false };
  }

  dados.count++;
  tentativasLogin.set(ip, dados);

  if (dados.count > MAX_TENTS) {
    const restante = Math.ceil((JANELA_MS - (agora - dados.desde)) / 60000);
    return { bloqueado: true, minutos: restante };
  }
  return { bloqueado: false };
}

function limparRateLimit(ip) {
  tentativasLogin.delete(ip);
}

setInterval(() => {
  const agora = Date.now();
  for (const [ip, dados] of tentativasLogin.entries()) {
    if (agora - dados.desde > JANELA_MS) tentativasLogin.delete(ip);
  }
}, 30 * 60 * 1000);

// ─── Validação de senha forte ─────────────────────────────────────────────────
function validarSenha(senha) {
  if (!senha || senha.length < 8) return "A senha precisa ter pelo menos 8 caracteres";
  if (!/[A-Z]/.test(senha))       return "Inclua pelo menos uma letra maiúscula";
  if (!/[0-9]/.test(senha))       return "Inclua pelo menos um número";
  return null;
}

// ─── Gerar JWT (expira em 8h) ─────────────────────────────────────────────────
function gerarToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

// ─── POST /auth/register ──────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ mensagem: "Email inválido" });
  }

  const erroSenha = validarSenha(senha);
  if (erroSenha) {
    return res.status(400).json({ mensagem: erroSenha });
  }

  try {
    const emailLimpo = email.toLowerCase().trim();

    const existente = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [emailLimpo]
    );
    if (existente.rows.length > 0) {
      return res.status(400).json({ mensagem: "Não foi possível criar a conta. Tente outro email." });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const { rows } = await pool.query(
      "INSERT INTO usuarios (email, senha_hash, criado_em) VALUES ($1, $2, NOW()) RETURNING id",
      [emailLimpo, senhaHash]
    );
    const novoUsuarioId = rows[0].id;

    // ✅ Já devolve o token, igual o /login — o frontend pode logar
    // automaticamente sem pedir pra pessoa digitar a senha de novo.
    return res.status(201).json({
      mensagem: "Conta criada com sucesso",
      token: gerarToken(novoUsuarioId),
      email: emailLimpo,
    });

  } catch (err) {
    console.error("[auth] Erro ao registrar:", err.message);
    return res.status(500).json({ mensagem: "Erro interno. Tente novamente." });
  }
});

// ─── POST /auth/login ─────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || "desconhecido";

  const limite = verificarRateLimit(ip);
  if (limite.bloqueado) {
    return res.status(429).json({
      mensagem: `Muitas tentativas. Aguarde ${limite.minutos} minuto(s).`
    });
  }

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
  }

  try {
    const emailLimpo = email.toLowerCase().trim();

    const resultado = await pool.query(
      "SELECT id, email, senha_hash FROM usuarios WHERE email = $1",
      [emailLimpo]
    );

    const usuario = resultado.rows[0];

    const hashFake    = "$2b$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const hashComparar = usuario ? usuario.senha_hash : hashFake;
    const senhaCorreta = await bcrypt.compare(senha, hashComparar);

    if (!usuario || !senhaCorreta) {
      return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    limparRateLimit(ip);

    pool.query(
      "UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = $1",
      [usuario.id]
    ).catch(() => {});

    return res.json({
      token: gerarToken(usuario.id),
      email: usuario.email,
    });

  } catch (err) {
    console.error("[auth] Erro ao fazer login:", err.message);
    return res.status(500).json({ mensagem: "Erro interno. Tente novamente." });
  }
});

module.exports = router;