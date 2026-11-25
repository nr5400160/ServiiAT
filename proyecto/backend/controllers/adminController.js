import { supabase } from '../config/supabase.js';
import bcrypt from "bcryptjs";


// 1. OBTENER SOLICITUDES (ADMIN)

export const obtenerSolicitudes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('solicitud')
      .select(`
        id_solicitud,
        fecha_solicitud, 
        hora_servicio,
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

    const ordenesPorSolicitud = new Map();
    const solicitudesIds = data.map((solicitud) => solicitud.id_solicitud);
    if (solicitudesIds.length > 0) {
      const { data: ordenes, error: ordenesError } = await supabase
        .from('orden_servicio')
        .select('id_solicitud, usuario_id_tecnico')
        .in('id_solicitud', solicitudesIds);

      if (ordenesError) throw ordenesError;
      for (const orden of ordenes || []) {
        ordenesPorSolicitud.set(orden.id_solicitud, orden);
      }
    }

    const tecnicosIds = [...new Set(
      [...ordenesPorSolicitud.values()]
        .map((orden) => orden.usuario_id_tecnico)
        .filter((id) => id !== null && id !== undefined)
        .map(Number)
    )];
    const tecnicosPorId = new Map();
    if (tecnicosIds.length > 0) {
      const { data: tecnicos, error: tecnicosError } = await supabase
        .from('usuario')
        .select('id_usuario, nombre_1, apellido_1')
        .in('id_usuario', tecnicosIds);

      if (tecnicosError) throw tecnicosError;
      for (const tecnico of tecnicos || []) {
        tecnicosPorId.set(Number(tecnico.id_usuario), tecnico);
      }
    }

    const resultadoPlano = data.map(s => {
      const correos = s.usuario?.correo_electronico;
      const emailCliente = Array.isArray(correos)
        ? correos[0]?.direccion_email
        : correos?.direccion_email;
      const orden = ordenesPorSolicitud.get(s.id_solicitud);
      const idTecnicoAsignado = orden?.usuario_id_tecnico ?? null;
      const tecnico = idTecnicoAsignado
        ? tecnicosPorId.get(Number(idTecnicoAsignado))
        : null;

      return {
        id_solicitud: s.id_solicitud,
        fecha_solicitud: s.fecha_solicitud,
        hora_servicio: s.hora_servicio,
        descripcion: s.descripcion,
        direccion_servicio: s.direccion_servicio,
        id_estado_solicitud: s.id_estado_solicitud,
        nombre_estado: s.estado?.nombre_estado || "Pendiente",
        nombre_equipo: s.equipo?.nombre_equipo || "Equipo",
        marca_equipo: s.equipo?.marca_equipo || "N/A",
        nombre_1: s.usuario?.nombre_1 || "Cliente",
        apellido_1: s.usuario?.apellido_1 || "",
        email: emailCliente || "",
        id_tecnico_asignado: idTecnicoAsignado,
        nombre_tecnico: tecnico
          ? `${tecnico.nombre_1 || ""} ${tecnico.apellido_1 || ""}`.trim()
          : ""
      };
    });

    res.json(resultadoPlano);

  } catch (error) {
    console.error("❌ Error admin:", error);
    res.status(500).json({ error: "Error al obtener solicitudes", detalle: error.message });
  }
};

export const obtenerTecnicos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nombre_1, apellido_1')
      .eq('id_roles', 2)
      .order('nombre_1', { ascending: true });

    if (error) throw error;
    res.json((data || []).map((tecnico) => ({
      id_usuario: tecnico.id_usuario,
      nombre: `${tecnico.nombre_1 || ""} ${tecnico.apellido_1 || ""}`.trim() || "Técnico"
    })));
  } catch (error) {
    console.error("Error al obtener técnicos para asignación:", error);
    res.status(500).json({ error: "No se pudo cargar la lista de técnicos." });
  }
};

export const resolverSolicitud = async (req, res) => {
  const idSolicitud = Number(req.params.id);
  const decision = req.body?.decision;
  const idTecnico = Number(req.body?.id_tecnico);

  if (!Number.isSafeInteger(idSolicitud) || idSolicitud <= 0) {
    return res.status(400).json({ error: "La solicitud indicada no es válida." });
  }
  if (!["aprobar", "rechazar"].includes(decision)) {
    return res.status(400).json({ error: "Selecciona aprobar o rechazar la solicitud." });
  }
  if (decision === "aprobar" && (!Number.isSafeInteger(idTecnico) || idTecnico <= 0)) {
    return res.status(400).json({ error: "Selecciona un técnico válido para asignar el servicio." });
  }

  try {
    const { data: solicitud, error: solicitudError } = await supabase
      .from('solicitud')
      .select('id_solicitud, fecha_solicitud, hora_servicio, id_estado_solicitud, estado(nombre_estado)')
      .eq('id_solicitud', idSolicitud)
      .maybeSingle();

    if (solicitudError) throw solicitudError;
    if (!solicitud) {
      return res.status(404).json({ error: "No se encontró la solicitud." });
    }
    if (solicitud.estado?.nombre_estado !== "Pendiente") {
      return res.status(409).json({ error: "Solo se pueden resolver solicitudes pendientes." });
    }

    const { data: ordenExistente, error: ordenError } = await supabase
      .from('orden_servicio')
      .select('id_orden_servicio, usuario_id_tecnico')
      .eq('id_solicitud', idSolicitud)
      .maybeSingle();

    if (ordenError) throw ordenError;

    if (decision === "rechazar") {
      if (ordenExistente?.usuario_id_tecnico) {
        return res.status(409).json({ error: "La solicitud ya fue asignada a un técnico." });
      }

      const { data: estadoCancelado, error: estadoError } = await supabase
        .from('estado')
        .select('id_estado')
        .eq('nombre_estado', 'Cancelado')
        .single();

      if (estadoError) throw estadoError;

      const { data: solicitudActualizada, error: actualizarError } = await supabase
        .from('solicitud')
        .update({ id_estado_solicitud: estadoCancelado.id_estado })
        .eq('id_solicitud', idSolicitud)
        .eq('id_estado_solicitud', solicitud.id_estado_solicitud)
        .select('id_solicitud')
        .maybeSingle();

      if (actualizarError) throw actualizarError;
      if (!solicitudActualizada) {
        return res.status(409).json({ error: "La solicitud cambió mientras se procesaba. Actualiza el panel." });
      }

      return res.json({
        mensaje: "Solicitud rechazada.",
        solicitud: { id_solicitud: idSolicitud, nombre_estado: "Cancelado" }
      });
    }

    const { data: tecnico, error: tecnicoError } = await supabase
      .from('usuario')
      .select('id_usuario, id_roles')
      .eq('id_usuario', idTecnico)
      .maybeSingle();

    if (tecnicoError) throw tecnicoError;
    if (!tecnico || Number(tecnico.id_roles) !== 2) {
      return res.status(400).json({ error: "El usuario seleccionado no es un técnico válido." });
    }
    if (ordenExistente?.usuario_id_tecnico) {
      if (Number(ordenExistente.usuario_id_tecnico) !== idTecnico) {
        return res.status(409).json({ error: "La solicitud ya está asignada a otro técnico." });
      }
    }

    const datosOrden = {
      fecha_orden: solicitud.fecha_solicitud,
      hora_servicio: solicitud.hora_servicio || "09:00:00",
      id_estado_orden: solicitud.id_estado_solicitud,
      usuario_id_tecnico: idTecnico
    };

    if (!ordenExistente?.usuario_id_tecnico) {
      if (ordenExistente) {
        const { data: ordenAsignada, error: asignarError } = await supabase
          .from('orden_servicio')
          .update(datosOrden)
          .eq('id_orden_servicio', ordenExistente.id_orden_servicio)
          .is('usuario_id_tecnico', null)
          .select('id_orden_servicio')
          .maybeSingle();

        if (asignarError) throw asignarError;
        if (!ordenAsignada) {
          return res.status(409).json({ error: "Otro administrador asignó esta solicitud. Actualiza el panel." });
        }
      } else {
        const { error: crearOrdenError } = await supabase
          .from('orden_servicio')
          .insert([{
            id_solicitud: idSolicitud,
            precio_servicio: 0,
            ...datosOrden
          }]);

        if (crearOrdenError?.code === "23505") {
          return res.status(409).json({ error: "Otro administrador asignó esta solicitud. Actualiza el panel." });
        }
        if (crearOrdenError) throw crearOrdenError;
      }
    }

    return res.json({
      mensaje: ordenExistente?.usuario_id_tecnico
        ? "La solicitud ya estaba aprobada y asignada a este técnico."
        : "Solicitud aprobada y asignada al técnico.",
      solicitud: {
        id_solicitud: idSolicitud,
        id_tecnico_asignado: idTecnico,
        nombre_estado: "Pendiente"
      }
    });
  } catch (error) {
    console.error("Error al aprobar/rechazar una solicitud:", error);
    return res.status(500).json({
      error: "No se pudo resolver la solicitud.",
      detalle: error.message
    });
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