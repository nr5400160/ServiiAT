import { Router } from 'express';
import { crearSolicitud } from '../controllers/solicitudesController.js';
import { verificarToken, permitirRoles } from '../seguridad/middlewareSeguridad.js';

const router = Router();

router.post('/solicitud', verificarToken, permitirRoles('cliente', 'administrador'), crearSolicitud);

export default router;