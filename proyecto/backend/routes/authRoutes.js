import { Router } from "express";
import { actualizarPerfil, login, obtenerPerfil, registro } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', requireAuth, obtenerPerfil);
router.put('/perfil', requireAuth, actualizarPerfil);


export default router;