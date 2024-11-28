// back/models/reservaModel.js
const db = require("../db");

const Reserva = {
    getAll: (callback) => {
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
        db.query(query, callback);
    },
    create: (data, callback) => {
        const {
            usuario_id,
            produtos_id,
            data: dataReserva,
            quantidade_pessoas,
        } = data;
        const query = `
            INSERT INTO reservas (usuario_id, produtos_id, data, quantidade_pessoas) 
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            usuario_id,
            produtos_id,
            dataReserva,
            quantidade_pessoas,
        ];
        db.query(query, values, callback);
    },
};

module.exports = Reserva;
