// backend/controllers/auth.controller.js
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nombre, apellido, email, password, rol } = req.body;

    try {
        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(400).json({ msg: 'Email ya registrado' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = new Usuario({ nombre, apellido, email, password: hashedPassword, rol });

        await usuario.save();

        res.status(201).json({ msg: 'Usuario creado correctamente' });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor', error: err });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al iniciar sesión' });
    }
};
