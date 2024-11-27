// back/routes/usuarioRoutes.js
const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const verificarAdmin = require("../middlewares/verificarAdmin");

const router = express.Router();

router.post("/login", usuarioController.login);
router.post("/", usuarioController.register);

module.exports = router;
