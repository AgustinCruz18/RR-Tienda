// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const usuarioCtrl = require('../controllers/usuario.controller');
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
// Ruta pública para solicitar recuperación
router.post('/forgot-password', usuarioCtrl.forgotPassword);
// Ruta pública para cambiar la contraseña con token
router.post('/reset-password', usuarioCtrl.resetPassword);
module.exports = router;
