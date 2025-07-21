// backend/routes/upload.routes.js
const express = require('express');
const router = express.Router();

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'productos', // Carpeta donde se almacenarán las imágenes en Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});


router.post('/upload', upload.single('imagen'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No se envió ninguna imagen' });
        }
        res.json({
            msg: 'Imagen subida correctamente',
            url: req.file.path,
        });
    } catch (error) {
        console.error('Error en /upload:', error);
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ msg: 'El archivo es demasiado grande. Máximo 5MB.' });
        }
        res.status(500).json({ msg: 'Error interno al subir imagen', error: error.message });
    }
});



module.exports = router;
