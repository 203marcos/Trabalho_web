// back/routes/produtoRoutes.js
const express = require("express");
const produtoController = require("../controllers/produtoController");
const verificarAdmin = require("../middlewares/verificarAdmin");

const router = express.Router();

router.get("/", produtoController.getAll);
router.get("/:id", produtoController.getById);
router.post("/", verificarAdmin, produtoController.create);
router.put("/:id", verificarAdmin, produtoController.update);
router.delete("/:id", verificarAdmin, produtoController.delete);

module.exports = router;
