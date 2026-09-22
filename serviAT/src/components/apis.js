const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};



// Query 1  Obtener todos los registros de la tabla usuario

export async function getServicios() {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?select=*`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return await res.json();
}



// Query 2  Obtener un usuario por ID

export async function getUsuarioPorId(id) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?id=eq.${id}&select=*`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener usuario");
  }

  return await res.json();
}



// Query 3  Buscar usuarios por nombre

export async function buscarUsuario(nombre) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?nombre=ilike.%${nombre}%&select=*`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Error al buscar usuario");
  }

  return await res.json();
}



// Query 4  Obtener usuario por correo electronico

export async function getUsuarioCorreo(correo) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?correo=eq.${correo}&select=*`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener correo");
  }

  return await res.json();
}



// Query 5  Obtener usuarios activos

export async function getUsuariosActivos() {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?activo=eq.true&select=*`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener usuarios activos");
  }

  return await res.json();
}



// Patch 1  Actualizar todos los datos de un usuario

export async function actualizarServicio(id, cambios) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify(cambios),
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar usuario");
  }

  const data = await res.json();

  return data[0];
}



// Patch 2  Actualizar el nombre de un usuario

export async function actualizarNombre(id, nombre) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ nombre }),
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar nombre");
  }

  return await res.json();
}



// Patch 3  Actualizar el correo de un usuario

export async function actualizarCorreo(id, correo) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ correo }),
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar correo");
  }

  return await res.json();
}



// Patch 4  Cambiar el estado activo de un usuario

export async function cambiarEstado(id, activo) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ activo }),
    }
  );

  if (!res.ok) {
    throw new Error("Error al cambiar estado");
  }

  return await res.json();
}



// Patch 5  Actualizar la contrasena de un usuario

export async function actualizarPassword(id, password) {

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuario?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ password }),
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar contrasena");
  }

  return await res.json();
}