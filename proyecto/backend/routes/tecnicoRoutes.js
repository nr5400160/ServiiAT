import express from 'express';
import {
  obtenerSolicitudesTecnico,
  cambiarEstadoPorTecnico,
  guardarPrecioServicio
} from '../controllers/tecnicoController.js';
import { verificarToken, permitirRoles } from '../seguridad/middlewareSeguridad.js';

const router = express.Router();


router.use(verificarToken, permitirRoles('tecnico'));

router.get('/solicitudes', obtenerSolicitudesTecnico);
router.put('/solicitudes/:id/estado', cambiarEstadoPorTecnico);
router.put('/solicitudes/:id/precio', guardarPrecioServicio);

export default router;