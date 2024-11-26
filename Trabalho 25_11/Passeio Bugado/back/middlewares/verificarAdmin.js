// back/middlewares/verificarAdmin.js
const verificarToken = require("./verificarToken");

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

module.exports = verificarAdmin;
