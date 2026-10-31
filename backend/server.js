import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';


// 1. IMPORTAMOS TODAS LAS RUTAS 
import authRoutes from './routes/authRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificacionesRoutes from './routes/notificacionesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001; 


// 2. MIDDLEWARES GENERALES

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('Servidor Core de ServiAT funcionando con Arquitectura 100% Modular 🚀');
});

// 3. ENRUTAMIENTO PRINCIPAL (Conectando los endpoints)

app.use('/api', authRoutes);
app.use('/api', solicitudRoutes);
app.use('/api', adminRoutes);
app.use('/api', notificacionesRoutes);


// 4. INICIAR EL SERVIDOR

app.listen(PORT, () => {

  console.log(`🚀 Servidor Core corriendo en: http://localhost:${PORT}`);
  console.log(`✅ Arquitectura Modular 100% Completada`);

});