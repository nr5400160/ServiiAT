import express from 'express';
import { 
  obtenerSolicitudesTecnico, 
  cambiarEstadoPorTecnico 
} from '../controllers/tecnicoController.js'; 

const router = express.Router();

// Rutas exclusivas para el técnico
router.get('/solicitudes', obtenerSolicitudesTecnico);
router.put('/solicitudes/:id/estado', cambiarEstadoPorTecnico);

export default router;