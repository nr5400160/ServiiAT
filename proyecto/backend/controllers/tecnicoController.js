import { supabase } from '../config/supabase.js';

// 1. OBTENER SOLICITUDES (VISTA TÉCNICO)

export const obtenerSolicitudesTecnico = async (req, res) => {
  try {
    const idTecnico = Number(req.auth?.id);
    if (!Number.isSafeInteger(idTecnico) || idTecnico <= 0) {
      return res.status(401).json({ error: 'La sesión del técnico no es válida.' });
    }

    const { data: ordenes, error: ordenesError } = await supabase
      .from('orden_servicio')
      .select('id_orden_servicio, id_solicitud, precio_servicio, usuario_id_tecnico')
      .eq('usuario_id_tecnico', idTecnico);

    if (ordenesError) throw ordenesError;
    if (!ordenes?.length) return res.json([]);

    const idsSolicitud = ordenes.map((orden) => orden.id_solicitud);
    const ordenesPorSolicitud = new Map(
      ordenes.map((orden) => [String(orden.id_solicitud), orden])
    );
    const { data: solicitudes, error: solicitudesError } = await supabase
      .from('solicitud')
      .select(`
        id_solicitud, 
        fecha_solicitud, 
        descripcion, 
        direccion_servicio,
        id_estado_solicitud,
        estado ( nombre_estado ),
        equipo ( nombre_equipo, marca_equipo ),
        usuario!fk_solicitud_cliente ( nombre_1, apellido_1 )
      `)
      .in('id_solicitud', idsSolicitud)
      .order('id_solicitud', { ascending: false });

    if (solicitudesError) throw solicitudesError;
    const solicitudesPagadas = new Set();
    const idsOrden = ordenes.map((orden) => orden.id_orden_servicio);
    const { data: tickets, error: ticketsError } = await supabase
      .from('ticket')
      .select('id_orden_servicio')
      .in('id_orden_servicio', idsOrden);

    if (ticketsError) throw ticketsError;
    for (const ticket of tickets || []) {
      solicitudesPagadas.add(ticket.id_orden_servicio);
    }

    const resultadoPlano = solicitudes.map(s => {
      const orden = ordenesPorSolicitud.get(String(s.id_solicitud));
      return {
        id_solicitud: s.id_solicitud,
        fecha_solicitud: s.fecha_solicitud,
        descripcion: s.descripcion,
        direccion_servicio: s.direccion_servicio,
        nombre_estado: s.estado?.nombre_estado || "Pendiente",
        nombre_equipo: s.equipo?.nombre_equipo || "Equipo no especificado",
        marca_equipo: s.equipo?.marca_equipo || "No especificada",
        nombre_1: s.usuario?.nombre_1 || "Cliente",
        apellido_1: s.usuario?.apellido_1 || "",
        precio_servicio: Number(orden?.precio_servicio) > 0
          ? orden.precio_servicio
        : null,
        pagado: solicitudesPagadas.has(orden?.id_orden_servicio)
      };
    });

    res.json(resultadoPlano);
  } catch (error) {
    console.error("❌ Error técnico:", error);
    res.status(500).json({ error: "Error al obtener solicitudes", detalle: error.message });
  }
};

export const guardarPrecioServicio = async (req, res) => {
  const idSolicitud = Number(req.params.id);
  const idTecnico = Number(req.auth.id);
  const precio = Number(req.body?.precio_servicio);

  if (!Number.isSafeInteger(idSolicitud) || idSolicitud <= 0) {
    return res.status(400).json({ error: 'La solicitud indicada no es válida.' });
  }
  if (!Number.isSafeInteger(idTecnico) || idTecnico <= 0) {
    return res.status(401).json({ error: 'La sesión del técnico no es válida.' });
  }

  if (!Number.isFinite(precio) || precio <= 0 || Math.round(precio * 100) !== precio * 100) {
    return res.status(400).json({ error: 'Ingresa un precio mayor que cero, con máximo dos decimales.' });
  }

  try {
    const { data: solicitud, error: solicitudError } = await supabase
      .from('solicitud')
      .select('id_solicitud, fecha_solicitud, hora_servicio, id_estado_solicitud, estado(nombre_estado)')
      .eq('id_solicitud', idSolicitud)
      .single();

    if (solicitudError) throw solicitudError;

    if (!['En proceso', 'Finalizado'].includes(solicitud.estado?.nombre_estado)) {
      return res.status(409).json({ error: 'El técnico solo puede cotizar un servicio en proceso o finalizado.' });
    }

    const { data: ordenExistente, error: ordenError } = await supabase
      .from('orden_servicio')
      .select('id_orden_servicio, precio_servicio, usuario_id_tecnico')
      .eq('id_solicitud', idSolicitud)
      .maybeSingle();

    if (ordenError) throw ordenError;

    if (ordenExistente) {
      if (Number(ordenExistente.usuario_id_tecnico) !== idTecnico) {
        return res.status(403).json({ error: 'Este trabajo está asignado a otro técnico.' });
      }

      const { data: ticket, error: ticketError } = await supabase
        .from('ticket')
        .select('id_ticket')
        .eq('id_orden_servicio', ordenExistente.id_orden_servicio)
        .maybeSingle();

      if (ticketError) throw ticketError;
      if (ticket) {
        return res.status(409).json({ error: 'El servicio ya fue pagado y su precio no se puede modificar.' });
      }

      if (Number(ordenExistente.precio_servicio) > 0
        && Number(ordenExistente.precio_servicio) !== precio) {
        return res.status(409).json({ error: 'La cotización ya fue enviada al cliente y no se puede modificar.' });
      }

      if (Number(ordenExistente.precio_servicio) === precio) {
        return res.json({
          mensaje: 'La cotización ya está guardada para el cliente.',
          precio_servicio: ordenExistente.precio_servicio
        });
      }
    }

    const { data: orden, error: guardarError } = await supabase
      .from('orden_servicio')
      .upsert({
        id_solicitud: idSolicitud,
        fecha_orden: solicitud.fecha_solicitud,
        hora_servicio: solicitud.hora_servicio || '09:00:00',
        precio_servicio: precio,
        id_estado_orden: solicitud.id_estado_solicitud,
        usuario_id_tecnico: idTecnico
      }, { onConflict: 'id_solicitud' })
      .select('id_orden_servicio, precio_servicio')
      .single();

    if (guardarError) throw guardarError;

    return res.json({
      mensaje: 'Precio guardado en pesos colombianos.',
      precio_servicio: orden.precio_servicio
    });
  } catch (error) {
    console.error('Error al guardar precio del servicio:', error);
    return res.status(500).json({ error: 'No se pudo guardar el precio del servicio.' });
  }
};

// ==========================================
// 2. ACEPTAR / RECHAZAR / FINALIZAR SOLICITUD
// ==========================================
export const cambiarEstadoPorTecnico = async (req, res) => {
  const idSolicitud = Number(req.params.id);
  const idTecnico = Number(req.auth.id);
  const nombreEstado = req.body?.nombre_estado;
  const estadosPermitidos = ['En proceso', 'Finalizado', 'Cancelado'];

  if (!Number.isSafeInteger(idSolicitud) || idSolicitud <= 0) {
    return res.status(400).json({ error: 'La solicitud indicada no es válida.' });
  }
  if (!Number.isSafeInteger(idTecnico) || idTecnico <= 0) {
    return res.status(401).json({ error: 'La sesión del técnico no es válida.' });
  }

  if (!estadosPermitidos.includes(nombreEstado)) {
    return res.status(400).json({ error: 'Selecciona un estado válido para el trabajo.' });
  }

  try {
    const { data: solicitud, error: solicitudError } = await supabase
      .from('solicitud')
      .select('id_solicitud, fecha_solicitud, hora_servicio, id_estado_solicitud, estado(nombre_estado)')
      .eq('id_solicitud', idSolicitud)
      .maybeSingle();

    if (solicitudError) throw solicitudError;
    if (!solicitud) {
      return res.status(404).json({ error: 'No se encontró la solicitud.' });
    }

    const { data: ordenExistente, error: ordenError } = await supabase
      .from('orden_servicio')
      .select('id_orden_servicio, usuario_id_tecnico')
      .eq('id_solicitud', idSolicitud)
      .maybeSingle();

    if (ordenError) throw ordenError;
    if (!ordenExistente) {
      return res.status(403).json({ error: 'Esta solicitud aún no ha sido asignada por el administrador.' });
    }
    if (Number(ordenExistente.usuario_id_tecnico) !== idTecnico) {
      return res.status(403).json({ error: 'Este trabajo está asignado a otro técnico.' });
    }

    const transicionesPermitidas = {
      Pendiente: ['En proceso', 'Cancelado'],
      'En proceso': ['Finalizado']
    };
    const estadoActual = solicitud.estado?.nombre_estado;

    if (estadoActual === nombreEstado) {
      return res.json({ mensaje: 'El trabajo ya tiene ese estado.', solicitud });
    }
    if (!transicionesPermitidas[estadoActual]?.includes(nombreEstado)) {
      return res.status(409).json({ error: 'No se puede cambiar el trabajo desde su estado actual.' });
    }

    const { data: estado, error: estadoError } = await supabase
      .from('estado')
      .select('id_estado')
      .eq('nombre_estado', nombreEstado)
      .single();

    if (estadoError) throw estadoError;

    const { error: actualizarOrdenError } = await supabase
      .from('orden_servicio')
      .update({ id_estado_orden: estado.id_estado })
      .eq('id_orden_servicio', ordenExistente.id_orden_servicio)
      .eq('usuario_id_tecnico', idTecnico);

    if (actualizarOrdenError) throw actualizarOrdenError;

    const { data: solicitudActualizada, error: actualizarError } = await supabase
      .from('solicitud')
      .update({ id_estado_solicitud: estado.id_estado })
      .eq('id_solicitud', idSolicitud)
      .eq('id_estado_solicitud', solicitud.id_estado_solicitud)
      .select('id_solicitud, estado(nombre_estado)')
      .maybeSingle();

    if (actualizarError) throw actualizarError;
    if (!solicitudActualizada) {
      return res.status(409).json({ error: 'El trabajo cambió mientras se actualizaba. Actualiza el panel e intenta de nuevo.' });
    }

    return res.json({
      mensaje: 'Estado actualizado y trabajo asignado al técnico.',
      solicitud: solicitudActualizada
    });
  } catch (error) {
    console.error("❌ Error al cambiar estado (Técnico):", error.message);
    return res.status(500).json({ error: 'No se pudo actualizar el estado del trabajo.' });
  }
};