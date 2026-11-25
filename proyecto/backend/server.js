import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// 1. IMPORTAMOS TODAS LAS RUTAS
import authRoutes from './routes/authRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificacionesRoutes from './routes/notificacionesRoutes.js';
import tecnicoRoutes from './routes/tecnicoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import pagosRoutes from './routes/pagosRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Verificación rápida al iniciar el servidor
if (!process.env.JWT_TOKEN) {
  console.warn(' ADVERTENCIA: Falta definir JWT_TOKEN en backend/.env');
}

// Orígenes permitidos desde .env (separados por coma) con respaldo local
const origenesPermitidos = (
  process.env.CORS_ORIGINS || 'http://localhost:5173'
).split(',').map((origen) => origen.trim());

// 2. MIDDLEWARES GENERALES
app.disable('x-powered-by');
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origin (Postman, curl, chequeos de salud) o desde orígenes autorizados
    if (!origin || origenesPermitidos.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origen bloqueado por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['x-nuevo-token']
}));

// Ruta de verificación de estado (health check)
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'Servidor Core de ServiAT funcionando con Arquitectura Modular 🚀'
  });
});

// 3. ENRUTAMIENTO PRINCIPAL
app.use('/api', authRoutes);
app.use('/api', solicitudRoutes);
app.use('/api', adminRoutes);
app.use('/api/tecnico', tecnicoRoutes);
app.use('/api', notificacionesRoutes);
app.use('/api/cliente', clienteRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/perfil', perfilRoutes);

// 4. RUTA NO ENCONTRADA (404) EN FORMATO JSON
app.use((req, res) => {
  res.status(404).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// 5. MANEJO GLOBAL DE ERRORES (JSON mal formado, CORS, errores no controlados)
app.use((err, req, res, next) => {
  console.error('❌ Error en el servidor:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor'
  });
});

// 6. INICIAR EL SERVIDOR
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Core corriendo en el puerto ${PORT}`);
  console.log(`🌐 Orígenes CORS permitidos: ${origenesPermitidos.join(', ')}`);
});