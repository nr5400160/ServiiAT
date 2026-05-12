import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './db.js';

const app = express();
const PORT = 3001;

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