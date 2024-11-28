// back/controllers/reservaController.js
const Reserva = require("../models/reservaModel");

const reservaController = {
    getAll: (req, res) => {
        Reserva.getAll((err, results) => {
            if (err)
                return res
                    .status(500)
                    .json({ error: "Erro ao buscar reservas" });
            res.json(results);
        });
    },
    create: (req, res) => {
        const data = req.body;
        Reserva.create(data, (err, results) => {
            if (err)
                return res.status(500).json({ error: "Erro ao fazer reserva" });
            res.status(201).json({
                message: "Reserva feita com sucesso!",
                id: results.insertId,
            });
        });
    },
};

module.exports = reservaController;
