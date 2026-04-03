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
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS bloqueado para esta origem: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-perfil-id"],
  credentials: true
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-perfil-id");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", require("./backend/routes/auth"));
app.use("/perfis", require("./backend/routes/perfis"));
app.use("/catalogo", require("./backend/routes/catalogo"));
app.use("/progresso", require("./backend/routes/progresso"));
app.use("/favoritos", require("./backend/routes/favoritos"));
app.use("/mangas", require("./backend/routes/mangas"));
app.use("/video", require("./backend/routes/video"));
app.use("/canais", require("./backend/routes/canais"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Tvxbox" });
});

app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({
    mensagem: err.message || "Erro interno no servidor"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tvxbox API rodando na porta ${PORT}`));