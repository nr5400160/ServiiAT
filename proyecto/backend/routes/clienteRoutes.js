import express from 'express';
import { obtenerHistorialCliente } from '../controllers/clienteController.js'; 

const router = express.Router();

// Ruta que recibe el ID y trae sus solicitudes
router.get('/solicitudes/:id', obtenerHistorialCliente);

export default router;