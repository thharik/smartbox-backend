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
// Guarda em memória: { "ip": { count, desde } }
// Reseta automaticamente após 15 min sem precisar de Redis
const tentativasLogin = new Map();
const JANELA_MS   = 15 * 60 * 1000; // 15 minutos
const MAX_TENTS   = 10;              // máximo de tentativas por IP

function verificarRateLimit(ip) {
  const agora = Date.now();
  const dados = tentativasLogin.get(ip);

  // Primeira tentativa ou janela expirada — reseta
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

// Limpa IPs antigos a cada 30 min (evita vazamento de memória)
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

  // Validar formato de email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ mensagem: "Email inválido" });
  }

  // Validar força da senha
  const erroSenha = validarSenha(senha);
  if (erroSenha) {
    return res.status(400).json({ mensagem: erroSenha });
  }

  try {
    const emailLimpo = email.toLowerCase().trim();

    // Verifica se já existe (mensagem genérica — não revela se email existe)
    const existente = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [emailLimpo]
    );
    if (existente.rows.length > 0) {
      return res.status(400).json({ mensagem: "Não foi possível criar a conta. Tente outro email." });
    }

    // Hash com bcrypt (custo 12)
    const senhaHash = await bcrypt.hash(senha, 12);

    await pool.query(
      "INSERT INTO usuarios (email, senha_hash, criado_em) VALUES ($1, $2, NOW())",
      [emailLimpo, senhaHash]
    );

    return res.status(201).json({ mensagem: "Conta criada com sucesso" });

  } catch (err) {
    console.error("[auth] Erro ao registrar:", err.message);
    return res.status(500).json({ mensagem: "Erro interno. Tente novamente." });
  }
});

// ─── POST /auth/login ─────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip || "desconhecido";

  // Rate limit por IP
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

    // Sempre compara hash mesmo se usuário não existe
    // (evita timing attack — atacante não descobre se email existe pelo tempo de resposta)
    const hashFake    = "$2b$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const hashComparar = usuario ? usuario.senha_hash : hashFake;
    const senhaCorreta = await bcrypt.compare(senha, hashComparar);

    if (!usuario || !senhaCorreta) {
      return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    // Login OK — limpa rate limit deste IP
    limparRateLimit(ip);

    // Registra último acesso (não bloqueia login se falhar)
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