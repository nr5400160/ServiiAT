import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';

export const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';

  if (!token) {
    return res.status(401).json({ error: 'Debes iniciar sesión para continuar.' });
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'La sesión expiró o no es válida. Inicia sesión nuevamente.' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
  }

  return next();
};
