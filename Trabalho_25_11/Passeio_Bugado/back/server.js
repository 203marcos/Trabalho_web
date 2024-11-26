// back/server.js
const express = require("express");
const bodyParser = require("body-parser");
const produtoRoutes = require("./routes/produtoRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// Configuração do CORS
app.use(cors());

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

// Usar as rotas de produtos, reservas e usuários
app.use("/api", produtoRoutes);
app.use("/api", reservaRoutes);
app.use("/api", usuarioRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
