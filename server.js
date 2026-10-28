import dotenv from 'dotenv';
// CRUCIAL: Cargar las variables antes de que se use la conexión de la base de datos
dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3001; 

// CONFIGURACIÓN DE SUPABASE

// Asegúrate de agregar estas variables a tu archivo .env.local
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_API_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);


// MIDDLEWARES

app.use(express.json());
app.use(cors({
  origin: 'https://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Core de ServiAT funcionando en puerto 3001 🚀');
});

// REGISTRO DE USUARIOS

app.post('/api/registro', async (req, res) => {
  const {
    nombre_1, nombre_2, apellido_1, apellido_2,
    tipo_documento, documento, clave, fecha_nacimiento,
    email, numero_tel, direccion_comp, rol
  } = req.body;

  const id_roles = parseInt(rol) || 1;
  

  try {
    // 1. Insertar el usuario
    const { data: resultUser, error: errUser } = await supabase
      .from('usuario')
      .insert([{
        nombre_1, nombre_2, apellido_1, apellido_2, 
        tipo_documento, documento, clave:clave.trim(), 
        fecha_nacimiento, id_roles
      }])
      .select();

    if (errUser) throw errUser;
    
    const nuevoId = resultUser[0].id_usuario;

    // 2. Insertar tablas relacionadas en paralelo
    const [resCorreo, resTel, resDir] = await Promise.all([
      supabase.from('correo_electronico').insert([{ direccion_email: email, tipo: 'Personal', id_usuario: nuevoId }]),
      supabase.from('telefono').insert([{ numero: numero_tel, tipo: 'Celular', id_usuario: nuevoId }]),
      supabase.from('direccion').insert([{ direccion_completa: direccion_comp, usuario_id_usuario: nuevoId }])
    ]);

    if (resCorreo.error || resTel.error || resDir.error) {
      console.error("❌ Error vinculando datos adicionales:", { resCorreo, resTel, resDir });
      return res.status(500).json({ error: "Error al vincular datos adicionales" });
    }

    console.log(`✅ Usuario ${nuevoId} registrado con éxito`);
    res.json({ mensaje: "Registro completo en Supabase" });

  } catch (error) {
    console.error("❌ Error en Usuario:", error.message);
    res.status(500).json({ error: "Error al guardar en Supabase", detalle: error.message });
  }
});

// ==========================================
// LOGIN
// ==========================================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Inner join inverso: Buscar en usuario asegurando que coincida el email en la tabla vinculada
    const { data, error } = await supabase
      .from('usuario')
      .select(`
        id_usuario, 
        nombre_1, 
        id_roles, 
        clave, 
        correo_electronico!inner(direccion_email)
      `)
      .eq('correo_electronico.direccion_email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ mensaje: "Correo no registrado" });
    }

    const user = data;
    const claveValida=bcrypt.compareSync(password.trim(),user.clave.trim());

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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SOLICITUD DE ASISTENCIA
// ==========================================
app.post('/api/solicitud', async (req, res) => {
  const {
    nombre_equipo, modelo_equipo, id_categoria_equipo, fecha_solicitud,
    descripcion, direccion_servicio, usuario_id_cliente, id_estado_solicitud,
    usuario_id_administrador
  } = req.body;

  try {
    // 1. Insertar equipo
    const { data: equipoResult, error: equipoErr } = await supabase
      .from('equipo')
      .insert([{
        nombre_equipo, 
        marca_equipo: 'No especificada', 
        modelo_equipo, 
        id_categoria_equipo
      }])
      .select();

    if (equipoErr) throw equipoErr;
    const idDelNuevoEquipo = equipoResult[0].id_equipo;

    // 2. Insertar solicitud
    const { data: solicitudResult, error: solicitudErr } = await supabase
      .from('solicitud')
      .insert([{
        fecha_solicitud, descripcion, direccion_servicio,
        usuario_id_administrador, usuario_id_cliente, 
        id_estado_solicitud, id_equipo: idDelNuevoEquipo
      }])
      .select();

    if (solicitudErr) throw solicitudErr;

    res.json({
      mensaje: "¡Solicitud y equipo guardados en Supabase con éxito!",
      id_solicitud: solicitudResult[0].id_solicitud
    });

  } catch (error) {
    console.error("❌ Error al insertar solicitud:", error);
    res.status(500).json({ error: "Error al guardar solicitud" });
  }
});

// ==========================================
// ADMIN LAYOUT
// ==========================================



// ==========================================
// OBTENER SOLICITUDES (ADMIN) CON CORREO DEL CLIENTE
// ==========================================
app.get('/api/admin/solicitudes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('solicitud')
      .select(`
        id_solicitud, 
        fecha_solicitud, 
        descripcion, 
        direccion_servicio,
        id_estado_solicitud,
        estado ( nombre_estado ),
        equipo ( nombre_equipo, marca_equipo ),
        usuario!fk_solicitud_cliente ( 
          nombre_1, 
          apellido_1,
          correo_electronico ( direccion_email )
        )
      `)
      .order('id_solicitud', { ascending: false });

    if (error) throw error;

    const resultadoPlano = data.map(s => {
      // Extraer el correo (soporta relación 1:N como arreglo o 1:1 como objeto)
      const correos = s.usuario?.correo_electronico;
      const emailCliente = Array.isArray(correos)
        ? correos[0]?.direccion_email
        : correos?.direccion_email;

      return {
        id_solicitud: s.id_solicitud,
        fecha_solicitud: s.fecha_solicitud,
        descripcion: s.descripcion,
        direccion_servicio: s.direccion_servicio,
        id_estado_solicitud: s.id_estado_solicitud,
        nombre_estado: s.estado_solicitud?.nombre_estado || "Pendiente",
        nombre_equipo: s.equipo?.nombre_equipo || "Equipo",
        marca_equipo: s.equipo?.marca_equipo || "N/A",
        nombre_1: s.usuario?.nombre_1 || "Cliente",
        apellido_1: s.usuario?.apellido_1 || "",
        email: emailCliente || ""
      };
    });

    res.json(resultadoPlano);

  } catch (error) {
    console.error("❌ Error admin:", error);
    res.status(500).json({ error: "Error al obtener solicitudes", detalle: error.message });
  }
});

// ACTUALIZAR ESTADO DE SOLICITUD (ADMIN)
// ==========================================
app.put('/api/admin/solicitudes/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { id_estado, nombre_estado } = req.body;

  try {
    let idEstadoFinal = id_estado;

    if (nombre_estado) {
      const { data: estadoRow } = await supabase
        .from('estado')
        .select('*')
        .eq('nombre_estado', nombre_estado)
        .single();

      if (estadoRow) {
        idEstadoFinal = estadoRow.id_estado_solicitud || estadoRow.id_estado;
      }
    }

    const { data, error } = await supabase
      .from('solicitud')
      .update({ id_estado_solicitud: idEstadoFinal })
      .eq('id_solicitud', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      mensaje: "Estado actualizado correctamente",
      solicitud: data
    });

  } catch (error) {
    console.error("❌ Error al actualizar estado:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONFIGURACIÓN NODEMAILER
// ==========================================
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

// ==========================================
// ENDPOINT NOTIFICACIONES (EMAIL)
// ==========================================
app.post('/api/notificaciones/enviar', async (req, res) => {
  try {
    const {nombreCliente, email, estado,fecha_solicitud,hora,descripcion,nombre_equipo } = req.body;
    let mensaje = "";

    switch (estado) {
      case "Pendiente":
        mensaje = `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                      <h2 style="color: #1abc9c;">¡Hola, ${nombreCliente}!</h2>
                      <p>Hemos recibido tu solicitud de servicio. Nuestro equipo técnico la está evaluando.</p>
                      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1abc9c;">
                        <h3 style="margin-top: 0;">Resumen de tu solicitud:</h3>
                        <ul>
                          <li><strong>Fecha programada:</strong> ${fecha_solicitud}</li>
                          <li><strong>Equipo a reparar:</strong> ${nombre_equipo}</li>
                          <li><strong>Descripción:</strong> ${descripcion}</li>
                        </ul>
                      </div>
                    </div>
                  `;
        break;

      case "En proceso":
        mensaje = `
                  <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #1abc9c;">¡Hola, ${nombreCliente}!</h2>
                    <p>Tu solicitud ha sido aprobada tras la revisión. Gracias por confiar en AR Asistencia Técnica.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1abc9c;">
                      <h3 style="margin-top: 0;">Resumen de tu solicitud:</h3>
                      <ul>
                        <li><strong>Fecha programada:</strong> ${fecha_solicitud}</li>
                        <li><strong>Hora programada:</strong> ${hora}</li>
                        <li><strong>Equipo a reparar:</strong> ${nombre_equipo}</li>
                        <li><strong>Descripción:</strong> ${descripcion}</li>
                      </ul>
                    </div>
                  </div>
                `;
        break;

      case "Cancelado":
        mensaje=  `
                  <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #e74c3c;">¡Hola, ${nombreCliente}!</h2>
                    <p>Tu solicitud ha sido rechazada por la fecha o hora elegidas, vuelva a enviar la solicitud.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1abc9c;">
                      <h3 style="margin-top: 0;">Resumen de tu solicitud:</h3>
                      <ul>
                        <li><strong>Fecha programada:</strong> ${fecha_solicitud}</li>
                        <li><strong>Hora programada:</strong> ${hora}</li>
                        <li><strong>Equipo a reparar:</strong> ${nombre_equipo}</li>
                        <li><strong>Descripción:</strong> ${descripcion}</li>
                      </ul>
                    </div>
                  </div>
                `;
        break;

      case "Finalizado":
        mensaje = `
                  <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #1abc9c;">¡Hola, ${nombreCliente}!</h2>
                    <p>El servicio ha sido liquidado. Estamos a la espera de la confirmación de tu pago.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1abc9c;">
                      <h3 style="margin-top: 0;">Resumen de tu solicitud:</h3>
                      <ul>
                        <li><strong>Fecha programada:</strong> ${fecha_solicitud}</li>
                        <li><strong>Hora programada:</strong> ${hora}</li>
                        <li><strong>Equipo a reparar:</strong> ${nombre_equipo}</li>
                        <li><strong>Descripción:</strong> ${descripcion}</li>
                      </ul>
                    </div>
                  </div>
                `;
        break;

      default:
        mensaje = "Hay una actualización en tu solicitud de servicio.";
    }

    const mailOpciones = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `AR Asistencia Técnica: Tu solicitud está ${estado}`,
      html: mensaje
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

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`🚀 Servidor Core corriendo en: http://localhost:${PORT}`);
  console.log(`✅ Conexión lista para supabase`);
  console.log(`==========================================`);
});