import { Router } from 'express';
import { enviarNotificacion } from '../controllers/notificacionesController.js';
import { verificarToken } from '../seguridad/middlewareSeguridad.js';

const router = Router();

router.post('/notificaciones/enviar', verificarToken, enviarNotificacion);

export default router;