// backend/routes/venta.routes.js
const express = require('express');
const router = express.Router();
const ventaCtrl = require('../controllers/venta.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { permitirRoles } = require('../middlewares/roles.middleware');

// Registrar venta (gerente o admin)
router.post('/', verificarToken, permitirRoles('admin', 'gerente'), ventaCtrl.registrarVenta);

// Ver historial (admin o gerente)
router.get('/', verificarToken, permitirRoles('admin', 'gerente'), ventaCtrl.obtenerVentas);
router.get('/filtro', verificarToken, permitirRoles('admin', 'gerente'), ventaCtrl.filtrarVentas);

module.exports = router;
