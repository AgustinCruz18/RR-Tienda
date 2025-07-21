//backend/controllers/usuario.controller.js
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Crear usuario (solo admin)
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, email, password, rol } = req.body;

        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(400).json({ msg: 'El email ya está registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ nombre, apellido, email, password: hashedPassword, rol });

        await nuevoUsuario.save();

        res.status(201).json({ msg: 'Usuario creado', usuario: nuevoUsuario });
    } catch (err) {
        res.status(500).json({ msg: 'Error al crear usuario', error: err.message });
    }
};

// Obtener todos (admin)
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ msg: 'Error al listar usuarios', error: err.message });
    }
};
// Obtener todos los usuarios (solo admin)
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, '-password'); // Excluye la contraseña
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
};
exports.eliminarUsuario = async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
};
exports.actualizarUsuario = async (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, email, rol, password } = req.body;

    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Si viene password, lo hasheamos
        if (password) {
            usuario.password = await bcrypt.hash(password, 10);
        }

        // Actualizamos los demás campos
        usuario.nombre = nombre ?? usuario.nombre;
        usuario.apellido = apellido ?? usuario.apellido;
        usuario.email = email ?? usuario.email;
        usuario.rol = rol ?? usuario.rol;

        await usuario.save();

        // Excluir password al enviar respuesta
        const { password: pw, ...usuarioSinPass } = usuario.toObject();

        res.json(usuarioSinPass);

    } catch (err) {
        res.status(500).json({ msg: 'Error al actualizar usuario', error: err.message });
    }
};
// Solicitar recuperación de contraseña
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ msg: 'Email no registrado' });

        // Generar token y fecha de expiración (1 hora)
        const token = crypto.randomBytes(20).toString('hex');
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora en ms
        await usuario.save();

        // Configura tu servicio SMTP o API de envío
        const transporter = nodemailer.createTransport({
            // Ejemplo Gmail SMTP
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `http://tu-frontend.com/reset-password/${token}`;
        //const resetUrl = `http://localhost:4200/resetear-contrasena/${token}`;

        const mailOptions = {
            to: usuario.email,
            from: 'no-reply@tuapp.com',
            subject: 'Recuperación de contraseña',
            text: `Hola ${usuario.nombre},\n\n
                Recibiste este email porque solicitaste restablecer tu contraseña.\n
                Haz click en el siguiente enlace para cambiarla:\n
                ${resetUrl}\n\n
                Si no solicitaste esto, ignora este mensaje.\n`
        };

        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Email enviado con instrucciones para restablecer la contraseña' });

    } catch (error) {
        console.error('Error en forgotPassword:', error); // 👈
        res.status(500).json({ msg: 'Error al enviar email', error: error.message });

    }
};

// Cambiar la contraseña con token
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ msg: 'Token inválido o expirado' });
        }

        usuario.password = await bcrypt.hash(newPassword, 10);
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        await usuario.save();

        res.json({ msg: 'Contraseña actualizada correctamente' });

    } catch (error) {
        res.status(500).json({ msg: 'Error al cambiar la contraseña', error: error.message });
    }
};