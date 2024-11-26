// back/controllers/produtoController.js
const Produto = require("../models/produtoModel");

const produtoController = {
    getAll: (req, res) => {
        Produto.getAll((err, results) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Erro ao buscar produtos" });
            res.json(results);
        });
    },
    getById: (req, res) => {
        const id = req.params.id;
        Produto.getById(id, (err, results) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Erro ao buscar produto" });
            if (results.length === 0)
                return res
                    .status(404)
                    .json({ error: "Produto não encontrado" });
            res.json(results[0]);
        });
    },
    create: (req, res) => {
        const data = req.body;
        Produto.create(data, (err, results) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Erro ao adicionar produto" });
            res.status(201).json({
                message: "Produto adicionado com sucesso!",
                id: results.insertId,
            });
        });
    },
    update: (req, res) => {
        const id = req.params.id;
        const data = req.body;
        Produto.update(id, data, (err, results) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Erro ao alterar produto" });
            if (results.affectedRows === 0)
                return res
                    .status(404)
                    .json({ error: "Produto não encontrado" });
            res.json({ message: "Produto alterado com sucesso!" });
        });
    },
    delete: (req, res) => {
        const id = req.params.id;
        Produto.delete(id, (err, results) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Erro ao excluir produto" });
            if (results.affectedRows === 0)
                return res
                    .status(404)
                    .json({ error: "Produto não encontrado" });
            res.json({ message: "Produto excluído com sucesso!" });
        });
    },
};

module.exports = produtoController;
