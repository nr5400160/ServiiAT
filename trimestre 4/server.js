import express from 'express';
import cors from 'cors';
import db from './db.js'; // Asegúrate de que termine en .js

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// 1. Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de ServiAT funcionando correctamente 🚀');
});

// 2. RUTA PARA REGISTRO (Conecta con Registro.jsx)
app.post('/api/registro', (req, res) => {
  const { email, password, rol } = req.body;
  const sql = "INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)";
  
  db.query(sql, [email, password, rol], (err, result) => {
    if (err) {
      console.error("Error al registrar:", err);
      return res.status(500).json({ error: "Error al guardar en Workbench" });
    }
    res.json({ mensaje: "Usuario guardado en MySQL con éxito" });
  });
});

// 3. RUTA PARA LOGIN (Conecta con Login.jsx)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    
    if (result.length > 0) {
      res.json({ mensaje: "Entrada válida", user: result[0] });
    } else {
      res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`✅ Conexión lista para MySQL Workbench`);
  console.log(`==========================================`);
});


