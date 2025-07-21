// backend/models/usuario.model.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: {
        type: String,
        enum: ['admin', 'gerente', 'cliente'],
        default: 'cliente'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

module.exports = mongoose.model('Usuario', usuarioSchema);
