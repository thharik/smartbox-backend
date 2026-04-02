require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app = express();

const allowedOrigins = [
  "https://tvxbox.com.br",
  "https://www.tvxbox.com.br",
  "http://localhost:3000",
  "http://127.0.0.1:5500",  // live-server local
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

app.use(express.json());

// ── Rotas ──────────────────────────────────────────────────────────────────
app.use("/auth",      require("./backend/routes/auth"));
app.use("/perfis",    require("./backend/routes/perfis"));
app.use("/catalogo",  require("./backend/routes/catalogo"));
app.use("/progresso", require("./backend/routes/progresso"));
app.use("/favoritos", require("./backend/routes/favoritos"));
app.use("/mangas",    require("./backend/routes/mangas"));   // ← NOVO
app.use("/video",     require("./backend/routes/video"));

app.get("/health", (_req, res) => res.json({ ok: true, app: "Tvxbox" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tvxbox API rodando na porta ${PORT}`));
