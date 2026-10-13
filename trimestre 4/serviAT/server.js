import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './server/db.js';// Tu conexión a Workbench
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import { authPlugins } from 'mysql2';
import { ReceiptJapaneseYen } from 'lucide-react';

dotenv.config({ path: '.env.local' });
const app = express();
const PORT = 3001;


app.use(express.json()); // permite leer el req.body de los formularios

app.use(cors());
app.use(express.json());

//configuracion de nodemailer con gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

//configuracion del pool en mysql

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//endpoints

app.post('/api/notificaciones/enviar', async (req, res) => {
  try {
    const { email, estado } = req.body;

    let mensaje = "";
    switch (estado) {
      case "Pendiente":
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
      to: email,
      subject: `AR Asistencia Técnica: Tu solicitud está ${estado}`,
      text: mensaje
    };

    //enviamos el correo
    await transporter.sendMail(mailOpciones);
    res.status(200).json({ message: 'Alerta enviada a Gmail exitosamente' });

  } catch (error) {
    console.error("Error al enviar el gmail", error);
    res.status(500).json({ error: 'Hubo un error al procesar el envío del correo' });
  }
})
//endpoint de registrar notificaciones 

app.post('/api/notificaciones', (req, res) => {

  const {
    titulo,
    mensaje,
    estado,
    usuario_id
  } = req.body;

  const sql = `
    INSERT INTO notificaciones
    (
      titulo,
      mensaje,
      estado,
      usuario_id
    )
    VALUES (?, ?, ?, ?)
  `;

  const valores = [
    titulo,
    mensaje,
    estado,
    usuario_id
  ];

  db.query(sql, valores, (err, result) => {

    if (err) {

      console.error("❌ Error al registrar notificación:", err);

      return res.status(500).json({
        error: "Error al guardar la notificación"
      });

    }

    res.status(201).json({
      mensaje: "✅ Notificación registrada correctamente",
      id_notificacion: result.insertId
    });

  });

});

app.post('/api/registro', (req, res) => {
  const {
    nombre_1, nombre_2, apellido_1, apellido_2,
    tipo_documento, documento, clave, fecha_nacimiento,
    email, numero_tel, direccion_comp, rol
  } = req.body;

  const id_roles = parseInt(rol) || 1;
  const claveEncriptada = bcrypt.hashSync(clave, 10);

  const sqlUsuario = `INSERT INTO usuario 
    (nombre_1, nombre_2, apellido_1, apellido_2, tipo_documento, documento, clave, fecha_nacimiento, id_roles) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sqlUsuario, [nombre_1, nombre_2, apellido_1, apellido_2, tipo_documento, documento, claveEncriptada, fecha_nacimiento, id_roles], (err, result) => {
    if (err) {
      console.error("❌ Error en Usuario:", err.message);
      return res.status(500).json({ error: "Error al guardar en Workbench", detalle: err.message });
    }

    const nuevoId = result.insertId;

    const sqlCorreo = `INSERT INTO correo_electronico (direccion_email, tipo, id_usuario) VALUES (?, 'Personal', ?)`;
    const sqlTelefono = `INSERT INTO telefono (numero, tipo, id_usuario) VALUES (?, 'Celular', ?)`;
    const sqlDireccion = `INSERT INTO direccion (direccion_completa, usuario_id_usuario) VALUES (?, ?)`;

    db.query(sqlCorreo, [email, nuevoId], (errC) => {
      db.query(sqlTelefono, [numero_tel, nuevoId], (errT) => {
        db.query(sqlDireccion, [direccion_comp, nuevoId], (errD) => {
          if (errC || errT || errD) {
            console.error("❌ Error vinculando datos:", { errC, errT, errD });
            return res.status(500).json({ error: "Error al vincular datos adicionales" });
          }
          console.log(`✅ Usuario ${nuevoId} registrado con éxito`);
          res.json({ mensaje: "Registro completo en Workbench" });
        });
      });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT u.id_usuario, u.nombre_1, u.id_roles, u.clave
    FROM usuario u
    JOIN correo_electronico c ON u.id_usuario = c.id_usuario
    WHERE c.direccion_email = ?`;

  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(401).json({ mensaje: "Correo no registrado" });
    }

    const user = result[0];
    const claveValida = bcrypt.compareSync(password, user.clave);

    if (!claveValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const rolesMap = { 3: 'admin', 2: 'tecnico', 1: 'cliente' };
    const rolTexto = rolesMap[user.id_roles] || 'cliente';

    res.json({
      mensaje: "Bienvenido",
      rol: rolTexto,
      id: user.id_usuario,
      nombre: user.nombre_1
    });
  });
});


//conexion con solicitud

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/api/servicios', (req, res) => {
  res.json({ mensaje: "CORS configurado exitosamente" });
});

//para la solicitud o fomrlario
app.post('/api/solicitud', (req, res) => {
  const {
    nombre_equipo,
    modelo_equipo,
    id_categoria_equipo,
    fecha_solicitud,
    descripcion,
    direccion_servicio,
    usuario_id_cliente,
    id_estado_solicitud,
    usuario_id_administrador
  } = req.body;

  // 1. insertar en equipo
  const sqlEquipo = "INSERT INTO equipo (nombre_equipo, marca_equipo, modelo_equipo, id_categoria_equipo) VALUES (?, 'No especificada', ?, ?)";

  db.query(sqlEquipo, [nombre_equipo, modelo_equipo, id_categoria_equipo], (err, equipoResult) => {
    if (err) {
      console.error("❌ Error al insertar equipo en MySQL:", err);
      return res.status(500).json({ error: "Error al guardar el equipo en la base de datos local." });
    }

    // capturamos el ID 
    const idDelNuevoEquipo = equipoResult.insertId;

    // 2. insetamos la solicitud usando el ID del equipo recien creado
    const sqlSolicitud = `
      INSERT INTO solicitud 
      (fecha_solicitud, descripcion, direccion_servicio, usuario_id_administrador, usuario_id_cliente, id_estado_solicitud, id_equipo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const valoresSolicitud = [
      fecha_solicitud,
      descripcion,
      direccion_servicio,
      usuario_id_administrador,
      usuario_id_cliente,
      id_estado_solicitud,
      idDelNuevoEquipo
    ];

    db.query(sqlSolicitud, valoresSolicitud, (err, solicitudResult) => {
      if (err) {
        console.error("❌ Error al insertar solicitud en MySQL:", err);
        return res.status(500).json({ error: "Error al guardar la solicitud en la base de datos local." });
      }

      res.json({
        mensaje: "¡Solicitud y equipo guardados en MySQL con éxito!",
        id_solicitud: solicitudResult.insertId
      });
    });
  });
});

app.listen(PORT, () => console.log(`🚀 Servidor con CORS listo en el puerto ${PORT}`));