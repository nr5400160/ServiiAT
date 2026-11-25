import { Router } from 'express';
import {
  obtenerSolicitudes,
  obtenerTecnicos,
  registrarUsuarioPorAdmin,
  resolverSolicitud
} from '../controllers/adminController.js';
import { verificarToken, permitirRoles } from '../seguridad/middlewareSeguridad.js';

const router = Router();

router.get('/admin/solicitudes', verificarToken, permitirRoles('administrador'), obtenerSolicitudes);
router.get('/admin/tecnicos', verificarToken, permitirRoles('administrador'), obtenerTecnicos);
router.put('/admin/solicitudes/:id/decision', verificarToken, permitirRoles('administrador'), resolverSolicitud);
router.post('/admin/crear-usuario', verificarToken, permitirRoles('administrador'), registrarUsuarioPorAdmin);

export default router;