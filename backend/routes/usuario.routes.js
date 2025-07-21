// backend/routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuario.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { permitirRoles } = require('../middlewares/roles.middleware');
const { esAdmin } = require('../middlewares/roles.middleware');

router.post('/', verificarToken, permitirRoles('admin'), usuarioCtrl.crearUsuario);
router.get('/', verificarToken, permitirRoles('admin'), usuarioCtrl.obtenerUsuarios);
//router.get('/listar', verificarToken, permitirRoles('admin'), usuarioCtrl.listarUsuarios);
router.get('/', verificarToken, esAdmin, usuarioCtrl.listarUsuarios);
router.delete('/:id', verificarToken, esAdmin, usuarioCtrl.eliminarUsuario);
router.put('/:id', verificarToken, permitirRoles('admin'), usuarioCtrl.actualizarUsuario);


module.exports = router;
