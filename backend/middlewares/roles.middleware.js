//backend/middlewares/roles.middleware.js
exports.esAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ msg: 'Acceso solo para administradores' });
    next();
};

exports.esGerente = (req, res, next) => {
    if (req.user.rol !== 'gerente') return res.status(403).json({ msg: 'Acceso solo para gerentes' });
    next();
};
// middlewares/roles.middleware.js
exports.permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ msg: 'No tenés permiso para acceder a esta función' });
        }
        next();
    };
};
