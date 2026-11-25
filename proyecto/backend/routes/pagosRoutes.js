import { Router } from 'express';
import {
  capturarOrdenPaypal,
  crearOrdenPaypal,
  obtenerModoPago
} from '../controllers/pagosController.js';
import { verificarToken, permitirRoles } from '../seguridad/middlewareSeguridad.js';

const router = Router();

router.use(verificarToken, permitirRoles('cliente'));

router.get('/modo', obtenerModoPago);
router.post('/solicitudes/:id/paypal/orden', crearOrdenPaypal);
router.post('/solicitudes/:id/paypal/capturar', capturarOrdenPaypal);

export default router;