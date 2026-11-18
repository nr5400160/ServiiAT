import { Router } from 'express';
import {
  obtenerSolicitudes,
  obtenerTecnicos,
  registrarUsuarioPorAdmin,
  resolverSolicitud
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use('/admin', requireAuth, requireRole('administrador'));

router.get('/admin/solicitudes', obtenerSolicitudes);
router.get('/admin/tecnicos', obtenerTecnicos);
router.put('/admin/solicitudes/:id/decision', resolverSolicitud);
router.post('/admin/crear-usuario', registrarUsuarioPorAdmin);

export default router;