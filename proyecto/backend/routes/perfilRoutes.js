import express from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controllers/perfilusuario.js';
import { verificarToken } from '../seguridad/middlewareSeguridad.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', obtenerPerfil);
router.put('/', actualizarPerfil);

export default router;