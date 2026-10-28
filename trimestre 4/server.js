<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './server/db.js';// Tu conexión a Workbench

const app = express();
const PORT = 3001; 


app.use(express.json()); // permite leer el req.body de los formularios

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`✅ Conexión lista para MySQL Workbench`);
  console.log(`==========================================`);
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
=======
import dotenv from 'dotenv';
// CRUCIAL: Cargar las variables antes de que se use la conexión de la base de datos
dotenv.config({ path: '.env.local' });

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './server/db.js';

const app = express();
const PORT = 3001; // Cambiado a 3001 para que sea tu servidor principal

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
      s.id_solicitud, s.fecha_solicitud, s.descripcion, s.direccion_servicio,
      es.nombre_estado, eq.nombre_equipo, eq.marca_equipo, u.nombre_1, u.apellido_1
    FROM solicitud s
    INNER JOIN estado_solicitud es ON s.id_estado_solicitud = es.id_estado_solicitud
    INNER JOIN equipo eq ON s.id_equipo = eq.id_equipo
    INNER JOIN usuario u ON s.usuario_id_cliente = u.id_usuario
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error admin:", err);
      return res.status(500).json({ error: "Error al obtener solicitudes" });
    }
    res.json(result);
  });
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
>>>>>>> 22f4317d38e417facea8f8a672e74acba573c735
