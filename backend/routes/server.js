require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://tvxbox.com.br",
  "https://www.tvxbox.com.br",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS bloqueado para esta origem: " + origin));
    }
  },
  credentials: true,
}));

// ── IMPORTANTE: webhook do Stripe precisa do body RAW antes do express.json()
app.use(
  "/assinatura/webhook",
  express.raw({ type: "application/json" }),
  require("./routes/assinatura")
);

app.use(express.json());

// ── Rotas ──────────────────────────────────────────────────────────────────
app.use("/auth", require("./routes/auth"));
app.use("/perfis", require("./routes/perfis"));
app.use("/catalogo", require("./routes/catalogo"));
app.use("/progresso", require("./routes/progresso"));
app.use("/favoritos", require("./routes/favoritos"));
app.use("/mangas", require("./routes/mangas"));
app.use("/canais", require("./routes/canais"));
app.use("/video", require("./routes/video"));
app.use("/assinatura", require("./routes/assinatura"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Tvxbox" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tvxbox API rodando na porta ${PORT}`));