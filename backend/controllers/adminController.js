import { supabase } from '../config/supabase.js';

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