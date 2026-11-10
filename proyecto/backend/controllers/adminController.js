import { supabase } from '../config/supabase.js';
import bcrypt from "bcryptjs";

// ==========================================
// 1. OBTENER SOLICITUDES (ADMIN)
// ==========================================
export const obtenerSolicitudes = async (req, res) => {
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
        nombre_estado: s.estado?.nombre_estado || "Pendiente",
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
};

// ==========================================
// 2. ACTUALIZAR ESTADO DE SOLICITUD (ADMIN)
// ==========================================
export const actualizarEstado = async (req, res) => {
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
};

// ==========================================
// 3. REGISTRAR TÉCNICOS Y ADMIN
// ==========================================
export const registrarUsuarioPorAdmin = async (req, res) => {
  const { 
    nombre_1, nombre_2, apellido_1, apellido_2,
    tipo_documento, documento, fecha_nacimiento,
    email, numero_tel, direccion_comp, rol 
  } = req.body;

  const id_roles = parseInt(rol);

  if (id_roles !== 2 && id_roles !== 3) {
    return res.status(400).json({ error: "Solo se pueden crear Técnicos o Administradores." });
  }

  const prefijo = id_roles === 2 ? "Tech" : "Admin";
  const passwordTemporal = `${prefijo}-${Math.random().toString(36).slice(-6)}*`;

  const salt = bcrypt.genSaltSync(10);
  const claveHasheada = bcrypt.hashSync(passwordTemporal, salt);

  try {
    const { data: resultUser, error: errUser } = await supabase
      .from('usuario')
      .insert([{
        nombre_1, nombre_2, apellido_1, apellido_2, 
        tipo_documento, documento, clave: claveHasheada,
        fecha_nacimiento, id_roles
      }])
      .select();

    if (errUser) throw errUser;
    const nuevoId = resultUser[0].id_usuario;

    await Promise.all([
      supabase.from('correo_electronico').insert([{ direccion_email: email, tipo: 'Laboral', id_usuario: nuevoId }]),
      supabase.from('telefono').insert([{ numero: numero_tel, tipo: 'Celular', id_usuario: nuevoId }]),
      supabase.from('direccion').insert([{ direccion_completa: direccion_comp, usuario_id_usuario: nuevoId }])
    ]);
    
    console.log(`✅ Empleado creado. Correo: ${email} | Clave temporal: ${passwordTemporal}`);
    
    res.json({ mensaje: "Usuario creado y credenciales generadas exitosamente." });

  } catch (error) {
    console.error("❌ Error al registrar empleado:", error);
    res.status(500).json({ error: "Error al registrar empleado", detalle: error.message });
  }
};