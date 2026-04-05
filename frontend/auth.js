/*
  auth.js — cuida do login e cadastro
  Chama o backend nas rotas /auth/login e /auth/register
*/

const loginForm    = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");
const copyPixBtn   = document.getElementById("copyPixBtn");
const pixCode      = document.getElementById("pixCode");

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

// Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;
    const msg   = document.getElementById("loginMensagem");

    msg.textContent = "Entrando...";

    try {
      const r = await fetch("https://tvxbox-backend-1.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await r.json();

      if (!r.ok) {
        msg.textContent = dados.mensagem || "Erro ao fazer login";
        return;
      }

      // Salva token e dados do usuário
      localStorage.setItem("sb_token", dados.token);
      localStorage.setItem("usuarioEmail", dados.email || email);

      // Limpa perfil anterior para forçar nova seleção correta
      localStorage.removeItem("sb_perfil_id");
      localStorage.removeItem("sb_perfil_nome");

      msg.textContent = "Login realizado com sucesso!";
      window.location.href = "index.html";
    } catch (erro) {
      console.error("Erro no login:", erro);
      msg.textContent = "Erro de conexão. Verifique se o servidor está rodando.";
    }
  });
}

// Cadastro
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value;
    const msg   = document.getElementById("cadastroMensagem");

    msg.textContent = "Criando conta...";

    try {
      const r = await fetch("https://tvxbox-backend-1.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await r.json();

      if (!r.ok) {
        msg.textContent = dados.mensagem || "Erro ao cadastrar";
        return;
      }

      msg.textContent = "Conta criada! Redirecionando...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    } catch (erro) {
      console.error("Erro no cadastro:", erro);
      msg.textContent = "Erro de conexão. Verifique se o servidor está rodando.";
    }
  });
}