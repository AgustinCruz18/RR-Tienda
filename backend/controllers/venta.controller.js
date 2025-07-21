// backend/controllers/venta.controller.js
const Venta = require('../models/venta.model');
const Producto = require('../models/producto.model');

exports.registrarVenta = async (req, res) => {
    try {
        const { producto, cantidad, comentario, cliente } = req.body;
        const usuarioId = req.user.id;

        const prod = await Producto.findById(producto);
        if (!prod) return res.status(404).json({ msg: 'Producto no encontrado' });

        // Validar stock suficiente en unidades
        if (prod.unidadesDisponibles < cantidad) {
            return res.status(400).json({ msg: 'Stock insuficiente en unidades' });
        }

        const total = prod.precio * cantidad;

        // Descontar unidades disponibles
        prod.unidadesDisponibles -= cantidad;

        // Actualizar stock si querés (opcional) cuando las unidades bajan por paquete:
        // prod.stock = Math.floor(prod.unidadesDisponibles / prod.unidadesPorPaquete);

        await prod.save();

        const nuevaVenta = new Venta({
            producto,
            cantidad,
            precioUnitario: prod.precio,
            total,
            comentario,
            cliente,
            registradaPor: usuarioId
        });

        await nuevaVenta.save();

        res.status(201).json({ msg: 'Venta registrada', venta: nuevaVenta });
    } catch (error) {
        console.error('Error al registrar venta:', error);
        res.status(500).json({ msg: 'Error al registrar venta', error: error.message });
    }
};

exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.find()
            .populate('producto', 'nombre precio')
            .populate('registradaPor', 'nombre apellido rol');
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener ventas', error: error.message });
    }
};
exports.filtrarVentas = async (req, res) => {
    try {
        const { productoId, desde, hasta } = req.query;
        const filtro = {};

        if (productoId) filtro.producto = productoId;
        if (desde || hasta) {
            filtro.fecha = {};
            if (desde) filtro.fecha.$gte = new Date(desde);
            if (hasta) filtro.fecha.$lte = new Date(hasta);
        }

        const ventas = await Venta.find(filtro)
            .populate('producto', 'nombre')
            .populate('registradaPor', 'nombre apellido');

        res.json(ventas);
    } catch (err) {
        res.status(500).json({ msg: 'Error al filtrar ventas', error: err.message });
    }
};
