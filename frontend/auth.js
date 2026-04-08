/*
  auth.js — login, cadastro e verificação de assinatura
*/
 
const loginForm    = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");
const copyPixBtn   = document.getElementById("copyPixBtn");
const pixCode      = document.getElementById("pixCode");
 
const BACKEND = "https://tvxbox-backend-1.onrender.com";
 
// Botão copiar chave Pix
if (copyPixBtn && pixCode) {
  copyPixBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pixCode.value);
      copyPixBtn.textContent = "Copiado!";
      setTimeout(() => { copyPixBtn.textContent = "Copiar Pix"; }, 1400);
    } catch {
      copyPixBtn.textContent = "Erro ao copiar";
      setTimeout(() => { copyPixBtn.textContent = "Copiar Pix"; }, 1400);
    }
  });
}
 
// ─── Login ────────────────────────────────────────────────────────────────────
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
 
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;
    const msg   = document.getElementById("loginMensagem");
 
    msg.textContent = "Entrando...";
 
    try {
      // 1) Login
      const r = await fetch(BACKEND + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
 
      const dados = await r.json();
 
      if (!r.ok) {
        msg.textContent = dados.mensagem || "Erro ao fazer login";
        return;
      }
 
      // Salva token
      localStorage.setItem("sb_token", JSON.stringify(dados.token));
      localStorage.setItem("usuarioEmail", dados.email || email);
      localStorage.removeItem("sb_perfil_id");
      localStorage.removeItem("sb_perfil_nome");
 
      // 2) Verifica assinatura
      msg.textContent = "Verificando assinatura...";
      const rs = await fetch(BACKEND + "/assinatura/status", {
        headers: { "Authorization": "Bearer " + dados.token }
      });
      const assinatura = await rs.json();
 
      if (!assinatura.ativa) {
        msg.textContent = "";
        const banner = document.getElementById("bannerAssinatura");
        if (banner) {
          banner.style.display = "flex";  // mostra o banner corretamente
        }
        return;
      }
 
      // Assinatura ativa — segue para o app
      msg.textContent = "Login realizado com sucesso!";
      window.location.href = "index.html";
 
    } catch (erro) {
      console.error("Erro no login:", erro);
      msg.textContent = "Erro de conexão. Verifique se o servidor está rodando.";
    }
  });
}
 
// ─── Cadastro ─────────────────────────────────────────────────────────────────
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();
 
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value;
    const msg   = document.getElementById("cadastroMensagem");
 
    msg.textContent = "Criando conta...";
 
    try {
      const r = await fetch(BACKEND + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
 
      const dados = await r.json();
 
      if (!r.ok) {
        msg.textContent = dados.mensagem || "Erro ao cadastrar";
        return;
      }
 
      msg.textContent = "Conta criada! Redirecionando para o login...";
      setTimeout(() => { window.location.href = "login.html"; }, 800);
    } catch (erro) {
      console.error("Erro no cadastro:", erro);
      msg.textContent = "Erro de conexão. Verifique se o servidor está rodando.";
    }
  });
}