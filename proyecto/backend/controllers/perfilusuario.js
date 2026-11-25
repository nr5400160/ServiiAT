import { supabase } from '../config/supabase.js';

// Busca el id_usuario ya sea por ID o por correo guardado en sesión
const resolverIdUsuario = async (req) => {
  const idRecibido = Number(req.params.id || req.query.id || req.body?.id_usuario);
  if (Number.isSafeInteger(idRecibido) && idRecibido > 0) {
    return idRecibido;
  }

  const email = (req.query.email || req.body?.email_actual || req.body?.email || '').trim();
  if (!email) return null;

  const { data, error } = await supabase
    .from('correo_electronico')
    .select('id_usuario')
    .eq('direccion_email', email)
    .limit(1);

  if (error) throw error;
  return data?.[0]?.id_usuario || null;
};

// 1. OBTENER PERFIL DEL USUARIO

export const obtenerPerfil = async (req, res) => {
  try {
    const idUsuario = await resolverIdUsuario(req);
    if (!idUsuario) {
      return res.status(400).json({ error: 'No se pudo identificar al usuario actual.' });
    }

    const [usuarioRes, correoRes, telefonoRes, direccionRes] = await Promise.all([
      supabase
        .from('usuario')
        .select('id_usuario, nombre_1, nombre_2, apellido_1, apellido_2')
        .eq('id_usuario', idUsuario)
        .maybeSingle(),
      supabase
        .from('correo_electronico')
        .select('direccion_email')
        .eq('id_usuario', idUsuario)
        .limit(1),
      supabase
        .from('telefono')
        .select('numero')
        .eq('id_usuario', idUsuario)
        .limit(1),
      supabase
        .from('direccion')
        .select('direccion_completa')
        .eq('usuario_id_usuario', idUsuario)
        .limit(1)
    ]);

    if (usuarioRes.error) throw usuarioRes.error;
    if (correoRes.error) throw correoRes.error;
    if (telefonoRes.error) throw telefonoRes.error;
    if (direccionRes.error) throw direccionRes.error;

    if (!usuarioRes.data) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.json({
      perfil: {
        nombre_1: usuarioRes.data.nombre_1 || '',
        nombre_2: usuarioRes.data.nombre_2 || '',
        apellido_1: usuarioRes.data.apellido_1 || '',
        apellido_2: usuarioRes.data.apellido_2 || '',
        email: correoRes.data?.[0]?.direccion_email || '',
        numero_tel: telefonoRes.data?.[0]?.numero || '',
        direccion: direccionRes.data?.[0]?.direccion_completa || ''
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    return res.status(500).json({ error: 'No se pudo cargar el perfil.', detalle: error.message });
  }
};


// 2. ACTUALIZAR PERFIL DEL USUARIO

export const actualizarPerfil = async (req, res) => {
  try {
    const idUsuario = await resolverIdUsuario(req);
    if (!idUsuario) {
      return res.status(400).json({ error: 'No se pudo identificar al usuario actual.' });
    }

    const nombre_1 = (req.body?.nombre_1 || '').trim();
    const nombre_2 = (req.body?.nombre_2 || '').trim();
    const apellido_1 = (req.body?.apellido_1 || '').trim();
    const apellido_2 = (req.body?.apellido_2 || '').trim();
    const email = (req.body?.email || '').trim();
    const numero_tel = (req.body?.numero_tel || '').trim();
    const direccion = (req.body?.direccion || '').trim();

    if (!nombre_1 || !apellido_1 || !email) {
      return res.status(400).json({ error: 'Primer nombre, primer apellido y correo son obligatorios.' });
    }

    // 1. Actualizar tabla usuario
    const { error: userError } = await supabase
      .from('usuario')
      .update({ nombre_1, nombre_2, apellido_1, apellido_2 })
      .eq('id_usuario', idUsuario);

    if (userError) throw userError;

    // 2. Actualizar o crear correo
    const { data: correoActual, error: errBuscarCorreo } = await supabase
      .from('correo_electronico')
      .select('id_usuario')
      .eq('id_usuario', idUsuario)
      .limit(1);

    if (errBuscarCorreo) throw errBuscarCorreo;

    if (correoActual?.length) {
      const { error } = await supabase
        .from('correo_electronico')
        .update({ direccion_email: email })
        .eq('id_usuario', idUsuario);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('correo_electronico')
        .insert([{ direccion_email: email, tipo: 'Personal', id_usuario: idUsuario }]);
      if (error) throw error;
    }

    // 3. Actualizar o crear teléfono
    const { data: telActual, error: errBuscarTel } = await supabase
      .from('telefono')
      .select('id_usuario')
      .eq('id_usuario', idUsuario)
      .limit(1);

    if (errBuscarTel) throw errBuscarTel;

    if (telActual?.length) {
      const { error } = await supabase
        .from('telefono')
        .update({ numero: numero_tel })
        .eq('id_usuario', idUsuario);
      if (error) throw error;
    } else if (numero_tel) {
      const { error } = await supabase
        .from('telefono')
        .insert([{ numero: numero_tel, tipo: 'Celular', id_usuario: idUsuario }]);
      if (error) throw error;
    }

    // 4. Actualizar o crear dirección
    const { data: dirActual, error: errBuscarDir } = await supabase
      .from('direccion')
      .select('usuario_id_usuario')
      .eq('usuario_id_usuario', idUsuario)
      .limit(1);

    if (errBuscarDir) throw errBuscarDir;

    if (dirActual?.length) {
      const { error } = await supabase
        .from('direccion')
        .update({ direccion_completa: direccion })
        .eq('usuario_id_usuario', idUsuario);
      if (error) throw error;
    } else if (direccion) {
      const { error } = await supabase
        .from('direccion')
        .insert([{ direccion_completa: direccion, usuario_id_usuario: idUsuario }]);
      if (error) throw error;
    }

    return res.json({
      mensaje: 'Perfil actualizado correctamente.',
      perfil: {
        nombre_1,
        nombre_2,
        apellido_1,
        apellido_2,
        email,
        numero_tel,
        direccion
      }
    });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    return res.status(500).json({ error: 'No se pudo actualizar el perfil.', detalle: error.message });
  }
};