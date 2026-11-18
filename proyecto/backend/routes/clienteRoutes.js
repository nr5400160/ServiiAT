import express from 'express';
import { obtenerHistorialCliente } from '../controllers/clienteController.js'; 
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta que recibe el ID y trae sus solicitudes
router.get('/solicitudes/:id', requireAuth, requireRole('cliente'), obtenerHistorialCliente);

export default router;