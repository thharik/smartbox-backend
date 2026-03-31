require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());

app.use("/auth",      require("./backend/routes/auth"));
app.use("/perfis",    require("./backend/routes/perfis"));
app.use("/catalogo",  require("./backend/routes/catalogo"));
app.use("/progresso", require("./backend/routes/progresso"));
app.use("/favoritos", require("./backend/routes/favoritos"));
app.use("/video",     require("./backend/routes/video"));

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SmartBox rodando na porta ${PORT}`));