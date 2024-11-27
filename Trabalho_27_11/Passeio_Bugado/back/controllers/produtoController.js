// back/controllers/produtoController.js
const Produto = require("../models/produtoModel");

const produtoController = {
    getAll: (req, res) => {
        console.log("Recebida requisição GET para /api/produtos");
        Produto.getAll((err, results) => {
            if (err) {
                console.error("Erro ao buscar produtos:", err);
                return res
                    .status(500)
                    .json({ error: "Erro ao buscar produtos" });
            }
            res.json(results);
        });
    },
    getById: (req, res) => {
        const id = req.params.id;
        console.log(`Recebida requisição GET para /api/produtos/${id}`);
        Produto.getById(id, (err, results) => {
            if (err) {
                console.error("Erro ao buscar produto:", err);
                return res
                    .status(500)
                    .json({ error: "Erro ao buscar produto" });
            }
            if (results.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Produto não encontrado" });
            }
            res.json(results[0]);
        });
    },
    create: (req, res) => {
        const data = req.body;
        console.log("Recebida requisição POST para /api/produtos", data);
        Produto.create(data, (err, results) => {
            if (err) {
                console.error("Erro ao adicionar produto:", err);
                return res
                    .status(500)
                    .json({ error: "Erro ao adicionar produto" });
            }
            res.status(201).json({
                message: "Produto adicionado com sucesso!",
                id: results.insertId,
            });
        });
    },
    update: (req, res) => {
        const id = req.params.id;
        const data = req.body;
        console.log(`Recebida requisição PUT para /api/produtos/${id}`, data);
        Produto.update(id, data, (err, results) => {
            if (err) {
                console.error("Erro ao alterar produto:", err);
                return res
                    .status(500)
                    .json({ error: "Erro ao alterar produto" });
            }
            if (results.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ error: "Produto não encontrado" });
            }
            res.json({ message: "Produto alterado com sucesso!" });
        });
    },
    delete: (req, res) => {
        const id = req.params.id;
        console.log(`Recebida requisição DELETE para /api/produtos/${id}`);
        Produto.delete(id, (err, results) => {
            if (err) {
                console.error("Erro ao excluir produto:", err);
                return res
                    .status(500)
                    .json({ error: "Erro ao excluir produto" });
            }
            if (results.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ error: "Produto não encontrado" });
            }
            res.json({ message: "Produto excluído com sucesso!" });
        });
    },
};

module.exports = produtoController;
