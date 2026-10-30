import { SupabaseClient } from "@supabase/supabase-js";

export const crearSolicitud = async(req,res)=>{
    const {
    nombre_equipo, modelo_equipo, id_categoria_equipo, fecha_solicitud,
    descripcion, direccion_servicio, usuario_id_cliente, id_estado_solicitud,
    usuario_id_administrador
  } = req.body;

  try {
    // 1. Insertar equipo
    const { data: equipoResult, error: equipoErr } = await supabase
      .from('equipo')
      .insert([{
        nombre_equipo, 
        marca_equipo: 'No especificada', 
        modelo_equipo, 
        id_categoria_equipo
      }])
      .select();

    if (equipoErr) throw equipoErr;
    const idDelNuevoEquipo = equipoResult[0].id_equipo;

    // 2. Insertar solicitud
    const { data: solicitudResult, error: solicitudErr } = await supabase
      .from('solicitud')
      .insert([{
        fecha_solicitud, descripcion, direccion_servicio,
        usuario_id_administrador, usuario_id_cliente, 
        id_estado_solicitud, id_equipo: idDelNuevoEquipo
      }])
      .select();

    if (solicitudErr) throw solicitudErr;

    res.json({
      mensaje: "¡Solicitud y equipo guardados en Supabase con éxito!",
      id_solicitud: solicitudResult[0].id_solicitud
    });

  } catch (error) {
    console.error("❌ Error al insertar solicitud:", error);
    res.status(500).json({ error: "Error al guardar solicitud" });
  }
}