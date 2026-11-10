import { Router } from 'express';
import { crearSolicitud } from '../controllers/solicitudesController.js';

const router = Router();

router.post('/solicitud', crearSolicitud);

export default router;
