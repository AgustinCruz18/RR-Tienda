// backend/models/producto.model.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }, // cantidad de paquetes
    unidadesPorPaquete: { type: Number, required: true }, // ej. 12
    unidadesDisponibles: { type: Number, required: true }, // calculado
    codigo: { type: String, required: true, unique: true },
    categoria: { type: String },
    genero: { type: String, enum: ['hombre', 'mujer', 'unisex'] },
    imagenUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
