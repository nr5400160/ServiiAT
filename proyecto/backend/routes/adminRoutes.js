import { Router } from 'express';
import { obtenerSolicitudes, actualizarEstado } from '../controllers/adminController.js';
import { registrarUsuarioPorAdmin } from '../controllers/adminController.js';

const router = Router();

router.get('/admin/solicitudes', obtenerSolicitudes);
router.put('/admin/solicitudes/:id/estado', actualizarEstado);
router.post('/admin/crear-usuario', registrarUsuarioPorAdmin);

export default router;