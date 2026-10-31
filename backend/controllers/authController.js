import { supabase } from '../config/supabase.js';
import bcrypt from "bcryptjs";

export const registro = async (req, res) => {
  
  
  const { 
    nombre_1, nombre_2, apellido_1, apellido_2,
    tipo_documento, documento, clave, fecha_nacimiento,
    email, numero_tel, direccion_comp, rol 
  } = req.body;

  const id_roles = parseInt(rol) || 1;
  

  try {
  
    const { data: resultUser, error: errUser } = await supabase
      .from('usuario')
      .insert([{
        nombre_1, nombre_2, apellido_1, apellido_2, 
        tipo_documento, documento, clave: clave.trim(), 
        fecha_nacimiento, id_roles
      }])
      .select();

    if (errUser) throw errUser;
    
    const nuevoId = resultUser[0].id_usuario;

    // 2. Insertar tablas relacionadas en paralelo
    const [resCorreo, resTel, resDir] = await Promise.all([
      supabase.from('correo_electronico').insert([{ direccion_email: email, tipo: 'Personal', id_usuario: nuevoId }]),
      supabase.from('telefono').insert([{ numero: numero_tel, tipo: 'Celular', id_usuario: nuevoId }]),
      supabase.from('direccion').insert([{ direccion_completa: direccion_comp, usuario_id_usuario: nuevoId }])
    ]);

    if (resCorreo.error || resTel.error || resDir.error) {
      console.error("❌ Error vinculando datos adicionales:", { resCorreo, resTel, resDir });
      return res.status(500).json({ error: "Error al vincular datos adicionales" });
    }

    console.log(`✅ Usuario ${nuevoId} registrado con éxito`);
    res.json({ mensaje: "Registro completo en Supabase" });

  } catch (error) {
    console.error("❌ Error en Usuario:", error.message);
    res.status(500).json({ error: "Error al guardar en Supabase", detalle: error.message });
  }

}; 



export const login = async(req,res)=>{
    const { email, password } = req.body;
    
      try {
        // Inner join inverso: Buscar en usuario asegurando que coincida el email en la tabla vinculada
        const { data, error } = await supabase
          .from('usuario')
          .select(`
            id_usuario, 
            nombre_1, 
            id_roles, 
            clave, 
            correo_electronico!inner(direccion_email)
          `)
          .eq('correo_electronico.direccion_email', email)
          .single();
    
        if (error || !data) {
          return res.status(401).json({ mensaje: "Correo no registrado" });
        }
    
        const user = data;
        const claveValida = (password.trim() === user.clave.trim());
    
        if (!claveValida) {
          return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }
       
    
        const rolesMap = { 3: 'admin', 2: 'tecnico', 1: 'cliente' };
        const rolTexto = rolesMap[user.id_roles] || 'cliente';
    
        res.json({
          mensaje: "Bienvenido",
          rol: rolTexto,
          id: user.id_usuario,
          nombre: user.nombre_1
        });
    
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
}
