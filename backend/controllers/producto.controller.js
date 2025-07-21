// backend/controllers/producto.controller.js
const Producto = require('../models/producto.model');
const cloudinary = require('../config/cloudinary');

// Crear producto
exports.crearProducto = async (req, res) => {
    try {
        // AHORA SE INCLUYEN LOS CAMPO FALTANTES
        const { nombre, descripcion, precio, stock, unidadesPorPaquete, codigo, imagenUrl, categoria, genero } = req.body;

        // Validamos que los datos necesarios lleguen
        if (!nombre || !codigo || !precio || stock === undefined || !unidadesPorPaquete) {
            return res.status(400).json({ msg: 'Faltan campos obligatorios: nombre, código, precio, stock y unidades por paquete.' });
        }

        const existe = await Producto.findOne({ codigo });
        if (existe) return res.status(400).json({ msg: 'Ya existe un producto con ese código' });

        // CALCULAMOS LAS UNIDADES DISPONIBLES
        const unidadesDisponibles = stock * unidadesPorPaquete;

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio,
            stock,
            unidadesPorPaquete,
            unidadesDisponibles, // Se añade el campo calculado
            codigo,
            imagenUrl,
            categoria,
            genero
        });

        await nuevoProducto.save();
        res.status(201).json({ msg: 'Producto creado correctamente', producto: nuevoProducto });
    } catch (err) {
        console.error('Error al crear producto:', err); // Añadimos un log para ver el error en la consola del servidor
        res.status(500).json({ msg: 'Error al crear producto', error: err.message });
    }
};

// Listar productos
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener productos', error: err.message });
    }
};

// Obtener uno por ID
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json(producto);
    } catch (err) {
        res.status(500).json({ msg: 'Error al buscar producto', error: err.message });
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, imagenUrl, categoria, unidadesPorPaquete, unidadesDisponibles } = req.body;

        const productoExistente = await Producto.findById(req.params.id);
        if (!productoExistente) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Si la imagen fue cambiada y existe una imagen anterior
        if (productoExistente.imagenUrl && productoExistente.imagenUrl !== imagenUrl) {
            const parts = productoExistente.imagenUrl.split('/upload/');
            if (parts.length >= 2) {
                const publicIdParts = parts[1].split('/');
                publicIdParts.shift(); // quitar versión
                const publicIdWithExt = publicIdParts.join('/');
                const public_id = publicIdWithExt.replace(/\.[^/.]+$/, "");
                await cloudinary.uploader.destroy(public_id);
            }
        }

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, precio, stock, imagenUrl, categoria, unidadesPorPaquete, unidadesDisponibles },
            { new: true }
        );

        if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });

        res.json({ msg: 'Producto actualizado', producto });
    } catch (err) {
        res.status(500).json({ msg: 'Error al actualizar', error: err.message });
    }
};


// Eliminar producto con eliminación de imagen en Cloudinary
exports.eliminarProducto = async (req, res) => {
    try {
        const productoId = req.params.id;
        const producto = await Producto.findById(productoId);

        if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });

        if (producto.imagenUrl) {
            const url = producto.imagenUrl;
            // Ejemplo URL:
            // https://res.cloudinary.com/dsx1en5vl/image/upload/v1752571296/productos/qjlwgpya7ppkvuhb0nvj.png

            // Extraemos el public_id exacto (carpeta + nombre sin extensión)
            // Primero obtenemos la parte después de /upload/
            const parts = url.split('/upload/');
            if (parts.length < 2) {
                return res.status(400).json({ msg: 'URL de imagen inválida para eliminación' });
            }
            // parts[1] = "v1752571296/productos/qjlwgpya7ppkvuhb0nvj.png"
            // Quitamos el prefijo de versión (v123456789)
            const publicIdWithVersion = parts[1];
            const publicIdParts = publicIdWithVersion.split('/');
            // publicIdParts = ['v1752571296', 'productos', 'qjlwgpya7ppkvuhb0nvj.png']

            // Quitamos la versión (primer elemento)
            publicIdParts.shift(); // queda ['productos', 'qjlwgpya7ppkvuhb0nvj.png']

            // Unimos para tener "productos/qjlwgpya7ppkvuhb0nvj.png"
            const publicIdWithExt = publicIdParts.join('/');

            // Quitamos la extensión
            const public_id = publicIdWithExt.replace(/\.[^/.]+$/, "");

            // Ahora sí, eliminamos la imagen en Cloudinary
            const result = await cloudinary.uploader.destroy(public_id);

            if (result.result !== 'ok') {
                console.warn('No se pudo eliminar imagen en Cloudinary:', result);
                // Podés optar por devolver error o seguir igual
            }
        }

        // Finalmente, elimina el producto de la BD
        await Producto.findByIdAndDelete(productoId);

        res.json({ msg: 'Producto e imagen eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto', error: error.message });
    }
};
exports.crearOActualizarPorCodigo = async (req, res) => {
    const { codigo, stock, unidadesPorPaquete } = req.body;
    try {
        let producto = await Producto.findOne({ codigo });

        if (producto) {
            // Solo actualizar stock y unidades disponibles
            producto.stock += stock;
            producto.unidadesDisponibles += stock * unidadesPorPaquete;
            await producto.save();
            return res.json({ msg: 'Producto existente actualizado', producto });
        }

        // Crear nuevo producto
        const nuevo = new Producto({
            ...req.body,
            unidadesDisponibles: stock * unidadesPorPaquete
        });
        await nuevo.save();
        res.status(201).json({ msg: 'Producto nuevo creado', producto: nuevo });

    } catch (error) {
        res.status(500).json({ msg: 'Error al registrar producto', error: error.message });
    }
};