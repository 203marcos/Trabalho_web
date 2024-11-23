const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3000;

// Configuração do CORS
app.use(cors());

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000, // 10 segundos
});

// Conexão com o banco de dados
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conectado ao banco de dados MySQL!");
});

// Rota para buscar produtos
app.get("/produtos", (req, res) => {
    db.query("SELECT * FROM produtos", (err, results) => {
        if (err) {
            console.error("Erro ao buscar produtos:", err);
            return res.status(500).json({ error: "Erro ao buscar produtos" });
        }
        res.json(results);
    });
});

// Middleware para verificar se o usuário está autenticado
const verificarToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Acesso negado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido" });
        }

        req.user = decoded;
        next();
    });
};

// Middleware para verificar se o usuário é administrador
const verificarAdmin = (req, res, next) => {
    verificarToken(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                error: "Acesso negado. Apenas administradores podem realizar esta ação.",
            });
        }
        next();
    });
};

// Rota para cadastrar usuários
app.post("/usuarios", verificarToken, async (req, res) => {
    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha || !role) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    // Verifica se o usuário logado é administrador se o papel for 'admin'
    if (role === "admin" && req.user.role !== "admin") {
        return res
            .status(403)
            .json({
                error: "Acesso negado. Apenas administradores podem criar contas de administrador.",
            });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const query =
        "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)";
    const values = [nome, email, hashedPassword, role];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar usuário:", err);
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email já cadastrado" });
            }
            return res.status(500).json({ error: "Erro ao cadastrar usuário" });
        }

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
});

// Rota para login de usuários
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (err, results) => {
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

            // Gera um token JWT
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

            // Retorna o nome, o email, o papel e o ID junto com o token
            res.status(200).json({
                message: "Login bem-sucedido",
                token,
                id: usuario.id, // Adiciona o ID do usuário na resposta
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role,
            });
        }
    );
});

// Rota para excluir produtos
app.delete("/produtos/:id", verificarAdmin, (req, res) => {
    const produtoId = req.params.id;

    db.query(
        "DELETE FROM produtos WHERE id = ?",
        [produtoId],
        (err, results) => {
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

            res.status(200).json({ message: "Produto excluído com sucesso!" });
        }
    );
});

// Rota para alterar produtos
app.put("/produtos/:id", verificarAdmin, (req, res) => {
    const produtoId = req.params.id;
    const { nome, descricao, preco, imagem } = req.body;

    // Verifica se todos os campos necessários foram fornecidos
    if (!nome || !descricao || !preco || !imagem) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const query = `
        UPDATE produtos 
        SET nome = ?, descricao = ?, preco = ?, imagem = ? 
        WHERE id = ?
    `;
    const values = [nome, descricao, preco, imagem, produtoId];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Erro ao alterar produto:", err);
            return res.status(500).json({ error: "Erro ao alterar produto" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.status(200).json({ message: "Produto alterado com sucesso!" });
    });
});

// Rota para adicionar produtos
app.post("/produtos", verificarAdmin, (req, res) => {
    const { nome, descricao, preco, imagem } = req.body;

    // Verifica se todos os campos necessários foram fornecidos
    if (!nome || !descricao || !preco || !imagem) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const query = `
        INSERT INTO produtos (nome, descricao, preco, imagem) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [nome, descricao, preco, imagem];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Erro ao adicionar produto:", err);
            return res.status(500).json({ error: "Erro ao adicionar produto" });
        }

        res.status(201).json({
            message: "Produto adicionado com sucesso!",
            id: results.insertId,
        });
    });
});

// Rota para reservar uma viagem
app.post("/reservas", (req, res) => {
    const { usuario_id, produtos_id, data, quantidade_pessoas } = req.body;

    console.log("Dados recebidos:", req.body); // Adicione este log

    // Verifica se todos os campos necessários foram fornecidos
    if (!usuario_id || !produtos_id || !data || !quantidade_pessoas) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const query = `
        INSERT INTO reservas (usuario_id, produtos_id, data, quantidade_pessoas) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [usuario_id, produtos_id, data, quantidade_pessoas];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Erro ao reservar viagem:", err);
            return res.status(500).json({ error: "Erro ao reservar viagem" });
        }

        res.status(201).json({
            message: "Reserva feita com sucesso!",
            id: results.insertId,
        });
    });
});

// Rota para o administrador ver todas as reservas
app.get("/reservas", verificarAdmin, (req, res) => {
    const query = `
        SELECT 
            reservas.id,
            reservas.data,
            reservas.quantidade_pessoas,
            usuarios.nome AS usuario_nome,
            usuarios.email AS usuario_email,
            produtos.nome AS produto_nome,
            produtos.preco AS produto_preco,
            (reservas.quantidade_pessoas * produtos.preco) AS valor_total
        FROM reservas
        JOIN usuarios ON reservas.usuario_id = usuarios.id
        JOIN produtos ON reservas.produtos_id = produtos.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar reservas:", err);
            return res.status(500).json({ error: "Erro ao buscar reservas" });
        }
        res.json(results);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
