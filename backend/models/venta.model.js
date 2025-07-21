// backend/models/venta.model.js
const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 }, // precio al momento de la venta
    total: { type: Number, required: true, min: 0 }, // precio × cantidad
    registradaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cliente: { type: String }, // nombre del cliente (opcional)
    comentario: { type: String },
    fecha: { type: Date, default: Date.now }
}, {
    timestamps: true // createdAt, updatedAt automáticos
});

module.exports = mongoose.model('Venta', ventaSchema);