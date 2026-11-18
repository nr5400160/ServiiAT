import express from 'express';
import { 
  obtenerSolicitudesTecnico, 
  cambiarEstadoPorTecnico,
  guardarPrecioServicio
} from '../controllers/tecnicoController.js'; 
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas exclusivas para el técnico
router.use(requireAuth, requireRole('tecnico'));
router.get('/solicitudes', obtenerSolicitudesTecnico);
router.put('/solicitudes/:id/estado', cambiarEstadoPorTecnico);
router.put('/solicitudes/:id/precio', guardarPrecioServicio);

export default router;