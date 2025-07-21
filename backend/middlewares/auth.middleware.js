//backend/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');


    if (!token) return res.status(403).json({ msg: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token inválido' });
    }
};
