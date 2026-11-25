import jwt from 'jsonwebtoken';

const obtenerSecreto = () => process.env.JWT_TOKEN || process.env.JWT_SECRET;

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];
  const secreto = obtenerSecreto();

  if (!secreto) {
    console.error('❌ Falta definir JWT_TOKEN en backend/.env');
    return res.status(500).json({ error: 'Error de configuración de seguridad en el servidor.' });
  }

  try {
    const decodificado = jwt.verify(token, secreto);

    // Quitamos iat y exp para re-firmar sin perder ningún dato del usuario
    const { iat, exp, ...datosUsuario } = decodificado;

    // Asegura que siempre exista .id (aunque el login haya guardado id_usuario)
    const usuarioNormalizado = {
      ...datosUsuario,
      id: datosUsuario.id ?? datosUsuario.id_usuario
    };

    // Disponible en req.auth (tecnicoController) y req.usuario (otros controladores)
    req.auth = usuarioNormalizado;
    req.usuario = usuarioNormalizado;

    // Renueva la sesión por 15 minutos conservando todos los campos
    const nuevoToken = jwt.sign(usuarioNormalizado, secreto, { expiresIn: '15m' });
    res.setHeader('x-nuevo-token', nuevoToken);

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Sesión expirada o token inválido.' });
  }
};

export const permitirRoles = (...rolesPermitidos) => {
  const rolesNormalizados = rolesPermitidos.map((r) => r.toLowerCase());

  return (req, res, next) => {
    const rolUsuario = String(req.auth?.rol || req.usuario?.rol || '').toLowerCase();

    if (!rolUsuario || !rolesNormalizados.includes(rolUsuario)) {
      return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso.' });
    }

    next();
  };
};