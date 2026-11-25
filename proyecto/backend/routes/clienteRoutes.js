import express from 'express';
import { obtenerHistorialCliente } from '../controllers/clienteController.js';
import { verificarToken, permitirRoles } from '../seguridad/middlewareSeguridad.js';

const router = express.Router();

router.use(verificarToken, permitirRoles('cliente'));


router.get('/solicitudes/:id', obtenerHistorialCliente);

export default router;