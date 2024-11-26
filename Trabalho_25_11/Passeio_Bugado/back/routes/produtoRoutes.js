// back/routes/produtoRoutes.js
const express = require("express");
const produtoController = require("../controllers/produtoController");
const verificarAdmin = require("../middlewares/verificarAdmin");

const router = express.Router();

router.get("/produtos", produtoController.getAll);
router.get("/produtos/:id", produtoController.getById);
router.post("/produtos", verificarAdmin, produtoController.create);
router.put("/produtos/:id", verificarAdmin, produtoController.update);
router.delete("/produtos/:id", verificarAdmin, produtoController.delete);

module.exports = router;
