import { supabase } from '../config/supabase.js';

export const obtenerHistorialCliente = async (req, res) => {
  const { id } = req.params; // El ID del cliente que inició sesión

  try {
    const { data, error } = await supabase
      .from('solicitud')
      .select(`
        id_solicitud, 
        fecha_solicitud, 
        descripcion, 
        direccion_servicio,
        estado ( nombre_estado ),
        equipo ( nombre_equipo, marca_equipo )
      `)
      .eq('usuario_id_cliente', id)
      .order('id_solicitud', { ascending: false });

    if (error) throw error;

    const idsSolicitud = data.map((solicitud) => solicitud.id_solicitud);
    const ordenesPorSolicitud = new Map();
    const solicitudesPagadas = new Set();

    if (idsSolicitud.length > 0) {
      const { data: ordenes, error: ordenesError } = await supabase
        .from('orden_servicio')
        .select('id_orden_servicio, id_solicitud, precio_servicio')
        .in('id_solicitud', idsSolicitud);

      if (ordenesError) throw ordenesError;

      for (const orden of ordenes || []) {
        ordenesPorSolicitud.set(orden.id_solicitud, orden);
      }

      const idsOrden = (ordenes || []).map((orden) => orden.id_orden_servicio);
      if (idsOrden.length > 0) {
        const { data: tickets, error: ticketsError } = await supabase
          .from('ticket')
          .select('id_orden_servicio')
          .in('id_orden_servicio', idsOrden);

        if (ticketsError) throw ticketsError;
        for (const ticket of tickets || []) {
          solicitudesPagadas.add(ticket.id_orden_servicio);
        }
      }
    }

    const resultadoPlano = data.map(s => ({
      id_solicitud: s.id_solicitud,
      fecha_solicitud: s.fecha_solicitud,
      descripcion: s.descripcion,
      direccion_servicio: s.direccion_servicio,
      nombre_estado: s.estado?.nombre_estado || "Pendiente",
      nombre_equipo: s.equipo?.nombre_equipo || "Equipo no especificado",
      marca_equipo: s.equipo?.marca_equipo || "No especificada",
      precio_servicio: ordenesPorSolicitud.get(s.id_solicitud)?.precio_servicio ?? null,
      pagado: solicitudesPagadas.has(ordenesPorSolicitud.get(s.id_solicitud)?.id_orden_servicio)
    }));

    res.json(resultadoPlano);
  } catch (error) {
    console.error("❌ Error al obtener historial del cliente:", error);
    res.status(500).json({ error: "Error al cargar historial", detalle: error.message });
  }
};