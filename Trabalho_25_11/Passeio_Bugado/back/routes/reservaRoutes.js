// back/routes/reservaRoutes.js
const express = require("express");
const reservaController = require("../controllers/reservaController");
const verificarAdmin = require("../middlewares/verificarAdmin");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

router.get("/reservas", verificarAdmin, reservaController.getAll);
router.post("/reservas", verificarToken, reservaController.create);

module.exports = router;
