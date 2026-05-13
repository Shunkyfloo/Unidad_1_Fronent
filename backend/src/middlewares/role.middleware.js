const { fail } = require('../utils/api-response');

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return fail(res, 'Solo los administradores pueden realizar esta acción.', 403);
  }
  return next();
}

function requireSelfOrAdmin(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return fail(res, 'Identificador inválido.', 400);
  }
  if (req.user.role === 'admin' || Number(req.user.id) === id) {
    return next();
  }
  return fail(res, 'No autorizado para acceder a este usuario.', 403);
}

module.exports = { requireAdmin, requireSelfOrAdmin };
