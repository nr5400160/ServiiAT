import { supabase } from '../config/supabase.js';

// ==========================================
// 1. OBTENER SOLICITUDES (VISTA TÉCNICO)
// ==========================================
export const obtenerSolicitudesTecnico = async (req, res) => {
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
        usuario!fk_solicitud_cliente ( nombre_1, apellido_1 )
      `)
      .order('id_solicitud', { ascending: false });

    if (error) throw error;

    const resultadoPlano = data.map(s => ({
      id_solicitud: s.id_solicitud,
      fecha_solicitud: s.fecha_solicitud,
      descripcion: s.descripcion,
      direccion_servicio: s.direccion_servicio,
      nombre_estado: s.estado?.nombre_estado || "Pendiente",
      nombre_equipo: s.equipo?.nombre_equipo || "Equipo no especificado",
      marca_equipo: s.equipo?.marca_equipo || "No especificada",
      nombre_1: s.usuario?.nombre_1 || "Cliente",
      apellido_1: s.usuario?.apellido_1 || ""
    }));

    res.json(resultadoPlano);
  } catch (error) {
    console.error("❌ Error técnico:", error);
    res.status(500).json({ error: "Error al obtener solicitudes", detalle: error.message });
  }
};

// ==========================================
// 2. ACEPTAR / RECHAZAR / FINALIZAR SOLICITUD
// ==========================================
export const cambiarEstadoPorTecnico = async (req, res) => {
  const { id } = req.params;
  const { id_estado } = req.body; 
  // Nota: Más adelante aquí recibiremos el "id_tecnico" para asignarle el trabajo en la BD.

  try {
    const { data, error } = await supabase
      .from('solicitud')
      .update({ id_estado_solicitud: id_estado })
      .eq('id_solicitud', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      mensaje: "Estado actualizado por el técnico exitosamente",
      solicitud: data
    });
  } catch (error) {
    console.error("❌ Error al cambiar estado (Técnico):", error.message);
    res.status(500).json({ error: error.message });
  }
};