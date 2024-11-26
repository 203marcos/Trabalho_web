// back/routes/usuarioRoutes.js
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

router.post("/login", usuarioController.login);
router.post("/usuarios", verificarToken, usuarioController.register);

module.exports = router;
