import dotenv from 'dotenv';
// Al estar en la raíz, se queda como estaba originalmente
dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import db from './server/db.js';

// Verificación de variables en consola
console.log("DB_HOST (Notificaciones):", process.env.DB_HOST);
console.log("DB_USER (Notificaciones):", process.env.DB_USER);
console.log("DB_NAME (Notificaciones):", process.env.DB_NAME);

const app = express();
const PORT = 3001; // SE QUEDA EN EL PUERTO 3001

// ===============================
// MIDDLEWARES
// ===============================
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===============================
// CONFIGURACIÓN NODEMAILER
// ===============================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// ===============================
// ENDPOINT NOTIFICACIONES (EMAIL)
// ===============================
app.post('/api/notificaciones/enviar', async (req, res) => {
  try {
    const { emailCliente, estado } = req.body;
    let mensaje = "";

    switch (estado) {
      case "En proceso":
        mensaje = "Hemos recibido tu solicitud. Nuestro equipo técnico la está evaluando.";
        break;

      case "Aceptada":
        mensaje = "Tu solicitud ha sido aprobada tras la revisión. Gracias por confiar en AR Asistencia Técnica.";
        break;

      case "Lista para pagar":
        mensaje = "El servicio ha sido liquidado. Estamos a la espera de la confirmación de tu pago.";
        break;

      default:
        mensaje = "Hay una actualización en tu solicitud de servicio.";
    }

    const mailOpciones = {
      from: process.env.GMAIL_USER,
      to: emailCliente,
      subject: `AR Asistencia Técnica: Tu solicitud está ${estado}`,
      text: mensaje
    };

    // Enviar correo
    await transporter.sendMail(mailOpciones);

    res.status(200).json({
      message: 'Alerta enviada a Gmail exitosamente'
    });

  } catch (error) {
    console.error("❌ Error al enviar el Gmail:", error);
    res.status(500).json({
      error: 'Hubo un error al procesar el envío del correo'
    });
  }
});

// =====================================
// ENDPOINT REGISTRAR NOTIFICACIÓN (BD)
// =====================================
app.post('/api/notificaciones', (req, res) => {
  const { titulo, mensaje, estado, usuario_id } = req.body;

  const sql = `
    INSERT INTO notificaciones (titulo, mensaje, estado, usuario_id)
    VALUES (?, ?, ?, ?)
  `;

  const valores = [titulo, mensaje, estado, usuario_id];

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error("❌ Error al registrar notificación:", err);
      return res.status(500).json({
        error: "Error al guardar la notificación"
      });
    }

    res.status(201).json({
      message: "✅ Notificación registrada correctamente",
      id_notificacion: result.insertId
    });
  });
});

// =====================================
// OBTENER NOTIFICACIONES DE UN USUARIO
// =====================================
app.get('/api/notificaciones/usuario/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM notificaciones WHERE usuario_id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener notificaciones:", err);
      return res.status(500).json({
        error: "Error al obtener las notificaciones"
      });
    }
    res.json(results);
  });
});

// Iniciar Escucha del Servidor
app.listen(PORT, () => {
  console.log("🚀 Servidor de Notificaciones corriendo en puerto " + PORT);
});