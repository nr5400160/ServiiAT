import dotenv from 'dotenv';
// CRUCIAL: Cargar las variables antes de que se use la conexión de la base de datos
dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import db from './server/db.js';

const app = express();
const PORT = 3001; // Cambiado a 3001 para que sea tu servidor principal

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(cors({
  origin: 'https://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// CONFIGURACIÓN NODEMAILER


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

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Core de ServiAT funcionando en puerto 3001 🚀');
});

// ==========================================
// REGISTRO DE USUARIOS
// ==========================================
app.post('/api/registro', (req, res) => {
  const {
    nombre_1, nombre_2, apellido_1, apellido_2,
    tipo_documento, documento, clave, fecha_nacimiento,
    email, numero_tel, direccion_comp, rol
  } = req.body;

  const id_roles = parseInt(rol) || 1;
  const claveEncriptada = bcrypt.hashSync(clave, 10);

  const sqlUsuario = `
    INSERT INTO usuario (nombre_1, nombre_2, apellido_1, apellido_2, tipo_documento, documento, clave, fecha_nacimiento, id_roles)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sqlUsuario,
    [nombre_1, nombre_2, apellido_1, apellido_2, tipo_documento, documento, claveEncriptada, fecha_nacimiento, id_roles],
    (err, result) => {
      if (err) {
        console.error("❌ Error en Usuario:", err.message);
        return res.status(500).json({
          error: "Error al guardar en Workbench",
          detalle: err.message
        });
      }

      const nuevoId = result.insertId;

      const sqlCorreo = `INSERT INTO correo_electronico (direccion_email, tipo, id_usuario) VALUES (?, 'Personal', ?)`;
      const sqlTelefono = `INSERT INTO telefono (numero, tipo, id_usuario) VALUES (?, 'Celular', ?)`;
      const sqlDireccion = `INSERT INTO direccion (direccion_completa, usuario_id_usuario) VALUES (?, ?)`;

      db.query(sqlCorreo, [email, nuevoId], (errC) => {
        db.query(sqlTelefono, [numero_tel, nuevoId], (errT) => {
          db.query(sqlDireccion, [direccion_comp, nuevoId], (errD) => {
            if (errC || errT || errD) {
              console.error("❌ Error vinculando datos adicionales:", { errC, errT, errD });
              return res.status(500).json({
                error: "Error al vincular datos adicionales"
              });
            }

            console.log(`✅ Usuario ${nuevoId} registrado con éxito`);
            res.json({
              mensaje: "Registro completo en Workbench"
            });
          });
        });
      });
    }
  );
});

// ==========================================
// LOGIN
// ==========================================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT u.id_usuario, u.nombre_1, u.id_roles, u.clave
    FROM usuario u
    JOIN correo_electronico c ON u.id_usuario = c.id_usuario
    WHERE c.direccion_email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

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

// ==========================================
// SOLICITUD DE ASISTENCIA
// ==========================================
app.post('/api/solicitud', (req, res) => {
  const {
    nombre_equipo, modelo_equipo, id_categoria_equipo, fecha_solicitud,
    descripcion, direccion_servicio, usuario_id_cliente, id_estado_solicitud,
    usuario_id_administrador
  } = req.body;

  // Insertar equipo primero
  const sqlEquipo = `
    INSERT INTO equipo (nombre_equipo, marca_equipo, modelo_equipo, id_categoria_equipo)
    VALUES (?, 'No especificada', ?, ?)
  `;

  db.query(sqlEquipo, [nombre_equipo, modelo_equipo, id_categoria_equipo], (err, equipoResult) => {
    if (err) {
      console.error("❌ Error al insertar equipo:", err);
      return res.status(500).json({ error: "Error al guardar equipo" });
    }

    const idDelNuevoEquipo = equipoResult.insertId;

    // Insertar la solicitud vinculada al equipo creado
    const sqlSolicitud = `
      INSERT INTO solicitud (fecha_solicitud, descripcion, direccion_servicio, usuario_id_administrador, usuario_id_cliente, id_estado_solicitud, id_equipo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const valoresSolicitud = [
      fecha_solicitud, descripcion, direccion_servicio,
      usuario_id_administrador, usuario_id_cliente, id_estado_solicitud,
      idDelNuevoEquipo
    ];

    db.query(sqlSolicitud, valoresSolicitud, (err, solicitudResult) => {
      if (err) {
        console.error("❌ Error al insertar solicitud:", err);
        return res.status(500).json({ error: "Error al guardar solicitud" });
      }

      res.json({
        mensaje: "¡Solicitud y equipo guardados en MySQL con éxito!",
        id_solicitud: solicitudResult.insertId
      });
    });
  });
});

// ==========================================
// ADMIN LAYOUT
// ==========================================
app.get('/api/admin/solicitudes', (req, res) => {

  const sql = `
SELECT
s.id_solicitud,
s.fecha_solicitud,
s.descripcion,
s.direccion_servicio,
es.nombre_estado,
eq.nombre_equipo,
eq.marca_equipo,
u.nombre_1,
u.apellido_1

FROM solicitud s

INNER JOIN estado es
ON s.id_estado_solicitud = es.id_estado

INNER JOIN equipo eq
ON s.id_equipo = eq.id_equipo

INNER JOIN usuario u
ON s.usuario_id_cliente = u.id_usuario
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(result);

  });

});
//editar estado de solicitud
app.put('/api/admin/solicitudes/:id', (req, res) => {

  const { id } = req.params;

  console.log("BODY RECIBIDO:", req.body);

  const { estado, tecnicoId } = req.body;

  const sqlEstado = `
    SELECT id_estado
    FROM estado
    WHERE nombre_estado = ?
    LIMIT 1
  `;

  db.query(sqlEstado, [estado], (err, rows) => {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Estado no encontrado" });
    }

    const idEstado = rows[0].id_estado;

    const sqlUpdate = `
     UPDATE solicitud
      SET
     id_estado_solicitud = ?,
     usuario_id_tecnico = ?
     .
     WHERE id_solicitud = ?
      `;

    db.query(sqlUpdate, [idEstado, tecnicoId, id], (err) => {

      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ mensaje: "Estado actualizado correctamente" });

    });

  });

});
//eliminar solicitud
app.delete('/api/admin/solicitudes/:id', (req, res) => {

  const { id } = req.params;

  const sql = `
    DELETE FROM solicitud
    WHERE id_solicitud = ?
  `;

  db.query(sql, [id], (err) => {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      mensaje: "Solicitud eliminada correctamente"
    });

  });

});
// ==========================================
// PANEL TECNICO
// ==========================================
app.get('/api/tecnico/:id/solicitudes', (req, res) => {

  const tecnicoId = req.params.id;

  const sql = `
    SELECT
      s.id_solicitud,
      s.fecha_solicitud,
      s.descripcion,
      s.direccion_servicio,
      es.nombre_estado,
      u.nombre_1,
      u.apellido_1
    FROM solicitud s

    INNER JOIN estado es
      ON s.id_estado_solicitud = es.id_estado

    INNER JOIN usuario u
      ON s.usuario_id_cliente = u.id_usuario

    WHERE s.usuario_id_tecnico = ?
  `;

  db.query(sql, [tecnicoId], (err, result) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(result);

  });

});
// ==========================================
// TECNICO ACEPTA SOLICITUD
// ==========================================

app.put('/api/tecnico/solicitud/:id/aceptar', (req, res) => {

  const { id } = req.params;

  const sqlActualizar = `
    UPDATE solicitud
    SET id_estado_solicitud = 2
    WHERE id_solicitud = ?
  `;

  db.query(sqlActualizar, [id], async (err) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    const sqlCorreo = `
      SELECT
        c.direccion_email,
        u.nombre_1
      FROM solicitud s

      INNER JOIN usuario u
      ON s.usuario_id_cliente = u.id_usuario

      INNER JOIN correo_electronico c
      ON u.id_usuario = c.id_usuario

      WHERE s.id_solicitud = ?
    `;

    db.query(sqlCorreo, [id], async (err, result) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (result.length > 0) {

        const correo = result[0].direccion_email;
        const nombre = result[0].nombre_1;

        try {

          await transporter.sendMail({

            from: "serviat@gmail.com",

            to: correo,

            subject: "Solicitud aceptada",

            html: `
              <h2>Hola ${nombre}</h2>

              <p>
                Tu solicitud ha sido aceptada por uno de nuestros técnicos.
              </p>

              <p>
                Pronto será atendida.
              </p>

              <p>
                Gracias por usar ServiAT.
              </p>
            `
          });

          console.log("Correo enviado a:", correo);

        } catch (error) {

          console.log("Error enviando correo:", error);

        }

      }

      res.json({
        mensaje: "Solicitud aceptada"
      });

    });

  });

});

// ENDPOINT NOTIFICACIONES (EMAIL)

app.post('/api/notificaciones/enviar', async (req, res) => {
  try {
    const { email, estado, nombreCliente, equipo, fecha, hora } = req.body;
    let asunto = "";
    let mensajeHtml = "";

    switch (estado) {
      case "Pendiente":
        asunto = "AR Asistencia Técnica: Solicitud Recibida";
        mensajeHtml = `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hola, ${nombreCliente || 'Cliente'}</h2>
            <p>Hemos recibido tu solicitud de servicio para tu <strong>${equipo || 'equipo'}</strong>.</p>
            <p><strong>Fecha programada:</strong> ${fecha || 'Por definir'}</p>
            <p><strong>Hora preferida:</strong> ${hora || 'Por definir'}</p>
            <p>Nuestro equipo está evaluando tu caso y pronto será atendido por Fabio Alexander Rojas Lara o uno de nuestros técnicos especializados.</p>
            <br>
            <p>Gracias por confiar en <strong>AR Asistencia Técnica</strong>.</p>
          </div>
        `;
        break;

      case "Aceptada":
        asunto = "AR Asistencia Técnica: Solicitud Aceptada";
        mensajeHtml = `<h2>Hola, ${nombreCliente || 'Cliente'}</h2><p>Tu solicitud ha sido aprobada tras la revisión. Pronto nos pondremos en contacto.</p>`;
        break;

      case "Lista para pagar":
        asunto = "AR Asistencia Técnica: Liquidación de Servicio";
        mensajeHtml = `<h2>Hola, ${nombreCliente || 'Cliente'}</h2><p>El servicio ha sido liquidado. Estamos a la espera de la confirmación de tu pago.</p>`;
        break;

      default:
        asunto = "AR Asistencia Técnica: Actualización de Solicitud";
        mensajeHtml = `<p>Hay una actualización en tu solicitud de servicio.</p>`;
    }


    const mailOpciones = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `AR Asistencia Técnica: Tu solicitud está ${estado}`,
      html: mensajeHtml
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
  console.log(`✅ Conexión lista para MySQL Workbench`);
  console.log(`==========================================`);
});




