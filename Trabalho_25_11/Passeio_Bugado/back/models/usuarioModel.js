// back/models/usuarioModel.js
const db = require("../db");
const bcrypt = require("bcrypt");

const Usuario = {
    getByEmail: (email, callback) => {
        db.query("SELECT * FROM usuarios WHERE email = ?", [email], callback);
    },
    create: async (data, callback) => {
        const { nome, email, senha, role } = data;
        const hashedPassword = await bcrypt.hash(senha, 10);
        db.query(
            "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
            [nome, email, hashedPassword, role],
            callback
        );
    },
};

module.exports = Usuario;
