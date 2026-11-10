import { supabase } from '../config/supabase.js';

export const crearSolicitud = async(req, res) => {
  const {
    equipo, modelo, categoria, fecha,
    descripcion, direccion, id_cliente
  } = req.body;

  try {
    // 1. Buscar el ID de la categoría (Corregido a minúscula: nombre_categoria)
    const { data: catData, error: catError } = await supabase
      .from('categoria_equipo')
      .select('id_categoria_equipo')
      .eq('nombre_categoria', categoria)
      .single();

    if (catError || !catData) throw new Error("Categoría no encontrada");

    // 2. Buscar el ID del estado 'Pendiente' (Corregido a minúscula: estado)
    const { data: estadoData, error: estadoError } = await supabase
      .from('estado')
      .select('id_estado')
      .eq('nombre_estado', 'Pendiente')
      .single();

    if (estadoError || !estadoData) throw new Error("Estado no encontrado");

    // 3. Insertar equipo 
    const { data: equipoResult, error: equipoErr } = await supabase
      .from('equipo')
      .insert([{
        nombre_equipo: equipo, 
        marca_equipo: 'No especificada', 
        modelo_equipo: modelo || 'N/A', 
        id_categoria_equipo: catData.id_categoria_equipo
      }])
      .select();

    if (equipoErr) throw equipoErr;
    const idDelNuevoEquipo = equipoResult[0].id_equipo;

    const idAdministrador = 2;

    // 4. Insertar solicitud
    const { data: solicitudResult, error: solicitudErr } = await supabase
      .from('solicitud')
      .insert([{
        fecha_solicitud: fecha, 
        descripcion: descripcion, 
        direccion_servicio: direccion, 
        usuario_id_administrador: idAdministrador, 
        usuario_id_cliente: id_cliente, 
        id_estado_solicitud: estadoData.id_estado, 
        id_equipo: idDelNuevoEquipo
      }])
      .select();

    if (solicitudErr) throw solicitudErr;

    res.json({
      mensaje: "¡Solicitud y equipo guardados en Supabase con éxito!",
      id_solicitud: solicitudResult[0].id_solicitud
    });

  } catch (error) {
    console.error("❌ Error al insertar solicitud:", error);
    res.status(500).json({ error: error.message || "Error al guardar solicitud" });
  }
}