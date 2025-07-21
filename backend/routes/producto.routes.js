const express = require('express');
const router = express.Router();
const productoCtrl = require('../controllers/producto.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { permitirRoles } = require('../middlewares/roles.middleware');

// Rutas protegidas para admin o gerente
router.post('/', verificarToken, permitirRoles('admin', 'gerente'), productoCtrl.crearProducto);
router.post('/codigo', verificarToken, permitirRoles('admin', 'gerente'), productoCtrl.crearOActualizarPorCodigo); // <-- esta línea nueva
router.get('/', productoCtrl.obtenerProductos);
router.get('/:id', productoCtrl.obtenerProductoPorId);
router.put('/:id', verificarToken, permitirRoles('admin', 'gerente'), productoCtrl.actualizarProducto);
router.delete('/:id', verificarToken, permitirRoles('admin', 'gerente'), productoCtrl.eliminarProducto);

module.exports = router;
