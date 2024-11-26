// back/controllers/usuarioController.js
const Usuario = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Adicione esta linha
require("dotenv").config();

const usuarioController = {
    login: (req, res) => {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }

        Usuario.getByEmail(email, async (err, results) => {
            if (err) {
                console.error("Erro ao buscar usuário:", err);
                return res
                    .status(500)
                    .json({ error: "Erro ao buscar usuário" });
            }
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Usuário não encontrado" });
            }

            const usuario = results[0];
            const match = await bcrypt.compare(senha, usuario.senha);
            if (!match) {
                return res.status(401).json({ error: "Senha incorreta" });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                message: "Login bem-sucedido",
                token,
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role,
            });
        });
    },
    register: (req, res) => {
        const { nome, email, senha, role } = req.body;

        if (!nome || !email || !senha || !role) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }

        Usuario.create({ nome, email, senha, role }, (err, results) => {
            if (err) {
                console.error("Erro ao cadastrar usuário:", err);
                if (err.code === "ER_DUP_ENTRY") {
                    return res
                        .status(400)
                        .json({ error: "Email já cadastrado" });
                }
                return res
                    .status(500)
                    .json({ error: "Erro ao cadastrar usuário" });
            }

            res.status(201).json({
                message: "Usuário cadastrado com sucesso!",
            });
        });
    },
};

module.exports = usuarioController;
