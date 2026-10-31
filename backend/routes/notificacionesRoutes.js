
import { Router } from 'express';
import { enviarNotificacion } from '../controllers/notificacionesController.js';

const router = Router();

router.post('/notificaciones/enviar', enviarNotificacion);

export default router;