import { Router } from 'express';
import { obtenerSolicitudes, actualizarEstado } from '../controllers/adminController.js';

const router = Router();

router.get('/admin/solicitudes', obtenerSolicitudes);
router.put('/admin/solicitudes/:id/estado', actualizarEstado);

export default router;