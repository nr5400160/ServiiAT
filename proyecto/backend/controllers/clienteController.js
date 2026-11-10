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
      .eq('usuario_id_cliente', id) // <--- Tu llave exacta de Supabase
      .order('id_solicitud', { ascending: false });

    if (error) throw error;

    const resultadoPlano = data.map(s => ({
      id_solicitud: s.id_solicitud,
      fecha_solicitud: s.fecha_solicitud,
      descripcion: s.descripcion,
      direccion_servicio: s.direccion_servicio,
      nombre_estado: s.estado?.nombre_estado || "Pendiente",
      nombre_equipo: s.equipo?.nombre_equipo || "Equipo no especificado",
      marca_equipo: s.equipo?.marca_equipo || "No especificada"
    }));

    res.json(resultadoPlano);
  } catch (error) {
    console.error("❌ Error al obtener historial del cliente:", error);
    res.status(500).json({ error: "Error al cargar historial", detalle: error.message });
  }
};