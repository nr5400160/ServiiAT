import { Router } from 'express';
import {
  crearPagoDemo,
  obtenerModoPago
} from '../controllers/pagosController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth, requireRole('cliente'));
router.get('/modo', obtenerModoPago);
router.post('/solicitudes/:id/demo', crearPagoDemo);

export default router;
