import { supabase } from '../config/supabase.js';
import { getSupabaseAdmin } from '../config/supabaseAdmin.js';
import { JWT_SECRET } from '../config/auth.js';
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

    const rolesMap = { 3: 'administrador', 2: 'tecnico', 1: 'cliente' };
    const rolTexto = rolesMap[data.id_roles] || 'cliente';

    const claveValida = bcrypt.compareSync(password.trim(), data.clave);
    if (!claveValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }
   
    const tokenReal = jwt.sign(
      { id: data.id_usuario, rol: rolTexto }, 
      JWT_SECRET,
      { expiresIn: '15m' } 
    );

    res.json({
      mensaje: "Bienvenido",
      rol: rolTexto,
      id: data.id_usuario,
      nombre: data.nombre_1,
      email: Array.isArray(data.correo_electronico)
        ? data.correo_electronico[0]?.direccion_email
        : data.correo_electronico?.direccion_email,
      token: tokenReal
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerDatosPerfil = async (idUsuario) => {
  const supabaseAdmin = getSupabaseAdmin();
  const [
    { data: usuario, error: usuarioError },
    { data: correos, error: correoError },
    { data: telefonos, error: telefonoError },
    { data: direcciones, error: direccionError }
  ] = await Promise.all([
    supabaseAdmin
      .from('usuario')
      .select('id_usuario, nombre_1, nombre_2, apellido_1, apellido_2')
      .eq('id_usuario', idUsuario)
      .maybeSingle(),
    supabaseAdmin
      .from('correo_electronico')
      .select('id_correo_electronico, direccion_email')
      .eq('id_usuario', idUsuario)
      .order('id_correo_electronico', { ascending: true })
      .limit(1),
    supabaseAdmin
      .from('telefono')
      .select('id_telefono, numero')
      .eq('id_usuario', idUsuario)
      .order('id_telefono', { ascending: true })
      .limit(1),
    supabaseAdmin
      .from('direccion')
      .select('id_direccion, direccion_completa')
      .eq('usuario_id_usuario', idUsuario)
      .order('id_direccion', { ascending: true })
      .limit(1)
  ]);

  if (usuarioError) throw usuarioError;
  if (correoError) throw correoError;
  if (telefonoError) throw telefonoError;
  if (direccionError) throw direccionError;
  if (!usuario) return null;

  return {
    id_usuario: usuario.id_usuario,
    nombre_1: usuario.nombre_1 || '',
    nombre_2: usuario.nombre_2 || '',
    apellido_1: usuario.apellido_1 || '',
    apellido_2: usuario.apellido_2 || '',
    email: correos[0]?.direccion_email || '',
    numero_tel: telefonos[0]?.numero || '',
    direccion: direcciones[0]?.direccion_completa || ''
  };
};

export const obtenerPerfil = async (req, res) => {
  const idUsuario = Number(req.auth.id);
  if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
    return res.status(401).json({ error: 'La sesión del usuario no es válida.' });
  }

  try {
    const perfil = await obtenerDatosPerfil(idUsuario);
    if (!perfil) return res.status(404).json({ error: 'No se encontró el perfil del usuario.' });
    return res.json({ perfil });
  } catch (error) {
    console.error('Error al consultar el perfil:', error);
    return res.status(500).json({ error: 'No se pudo cargar el perfil.' });
  }
};

export const actualizarPerfil = async (req, res) => {
  const idUsuario = Number(req.auth.id);
  if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
    return res.status(401).json({ error: 'La sesión del usuario no es válida.' });
  }

  const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');
  const perfil = {
    nombre_1: texto(req.body?.nombre_1),
    nombre_2: texto(req.body?.nombre_2),
    apellido_1: texto(req.body?.apellido_1),
    apellido_2: texto(req.body?.apellido_2),
    email: texto(req.body?.email).toLowerCase(),
    numero_tel: texto(req.body?.numero_tel),
    direccion: texto(req.body?.direccion)
  };

  if (!perfil.nombre_1 || !perfil.apellido_1 || !perfil.email) {
    return res.status(400).json({ error: 'Nombre, apellido y correo son obligatorios.' });
  }
  if (perfil.nombre_1.length > 45 || perfil.nombre_2.length > 45
    || perfil.apellido_1.length > 45 || perfil.apellido_2.length > 45) {
    return res.status(400).json({ error: 'Los nombres y apellidos no pueden superar 45 caracteres.' });
  }
  if (perfil.email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.email)) {
    return res.status(400).json({ error: 'Ingresa un correo electrónico válido.' });
  }
  if (perfil.numero_tel.length > 15 || perfil.direccion.length > 150) {
    return res.status(400).json({ error: 'El teléfono o la dirección superan la longitud permitida.' });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const [
      { data: usuario, error: usuarioError },
      { data: correoActual, error: correoError },
      { data: telefonoActual, error: telefonoError },
      { data: direccionActual, error: direccionError },
      { data: correoEnUso, error: correoEnUsoError }
    ] = await Promise.all([
      supabaseAdmin.from('usuario').select('id_usuario').eq('id_usuario', idUsuario).maybeSingle(),
      supabaseAdmin
        .from('correo_electronico')
        .select('id_correo_electronico')
        .eq('id_usuario', idUsuario)
        .order('id_correo_electronico', { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from('telefono')
        .select('id_telefono')
        .eq('id_usuario', idUsuario)
        .order('id_telefono', { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from('direccion')
        .select('id_direccion')
        .eq('usuario_id_usuario', idUsuario)
        .order('id_direccion', { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from('correo_electronico')
        .select('id_usuario')
        .eq('direccion_email', perfil.email)
        .maybeSingle()
    ]);

    if (usuarioError) throw usuarioError;
    if (correoError) throw correoError;
    if (telefonoError) throw telefonoError;
    if (direccionError) throw direccionError;
    if (correoEnUsoError) throw correoEnUsoError;
    if (!usuario) return res.status(404).json({ error: 'No se encontró el usuario.' });
    if (correoEnUso && Number(correoEnUso.id_usuario) !== idUsuario) {
      return res.status(409).json({ error: 'Ese correo ya está registrado por otro usuario.' });
    }

    const { error: actualizarCorreoError } = correoActual
      ? await supabaseAdmin
        .from('correo_electronico')
        .update({ direccion_email: perfil.email })
        .eq('id_correo_electronico', correoActual.id_correo_electronico)
      : await supabaseAdmin
        .from('correo_electronico')
        .insert([{ direccion_email: perfil.email, tipo: 'Personal', id_usuario: idUsuario }]);
    if (actualizarCorreoError) {
      if (actualizarCorreoError.code === '23505') {
        return res.status(409).json({ error: 'Ese correo ya está registrado por otro usuario.' });
      }
      throw actualizarCorreoError;
    }

    const { error: actualizarTelefonoError } = telefonoActual
      ? await supabaseAdmin
        .from('telefono')
        .update({ numero: perfil.numero_tel })
        .eq('id_telefono', telefonoActual.id_telefono)
      : await supabaseAdmin
        .from('telefono')
        .insert([{ numero: perfil.numero_tel, tipo: 'Celular', id_usuario: idUsuario }]);
    if (actualizarTelefonoError) throw actualizarTelefonoError;

    const { error: actualizarDireccionError } = direccionActual
      ? await supabaseAdmin
        .from('direccion')
        .update({ direccion_completa: perfil.direccion })
        .eq('id_direccion', direccionActual.id_direccion)
      : await supabaseAdmin
        .from('direccion')
        .insert([{
          direccion_completa: perfil.direccion,
          usuario_id_usuario: idUsuario
        }]);
    if (actualizarDireccionError) throw actualizarDireccionError;

    const { error: actualizarUsuarioError } = await supabaseAdmin
      .from('usuario')
      .update({
        nombre_1: perfil.nombre_1,
        nombre_2: perfil.nombre_2 || null,
        apellido_1: perfil.apellido_1,
        apellido_2: perfil.apellido_2 || null
      })
      .eq('id_usuario', idUsuario);
    if (actualizarUsuarioError) throw actualizarUsuarioError;

    const perfilActualizado = await obtenerDatosPerfil(idUsuario);
    return res.json({
      mensaje: 'Perfil actualizado correctamente.',
      perfil: perfilActualizado
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return res.status(500).json({ error: 'No se pudo actualizar el perfil.' });
  }
};