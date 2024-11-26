// back/models/produtoModel.js
const db = require("../db");

const Produto = {
    getAll: (callback) => {
        db.query("SELECT * FROM produtos", callback);
    },
    getById: (id, callback) => {
        db.query("SELECT * FROM produtos WHERE id = ?", [id], callback);
    },
    create: (data, callback) => {
        const { nome, descricao, preco, imagem } = data;
        db.query(
            "INSERT INTO produtos (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)",
            [nome, descricao, preco, imagem],
            callback
        );
    },
    update: (id, data, callback) => {
        const { nome, descricao, preco, imagem } = data;
        db.query(
            "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem = ? WHERE id = ?",
            [nome, descricao, preco, imagem, id],
            callback
        );
    },
    delete: (id, callback) => {
        db.query("DELETE FROM produtos WHERE id = ?", [id], callback);
    },
};

module.exports = Produto;
