import { useEffect, useState } from "react";
import "./PerfilUsuario.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const perfilInicial = {
  nombre_1: "",
  nombre_2: "",
  apellido_1: "",
  apellido_2: "",
  email: "",
  numero_tel: "",
  direccion: ""
};

function PerfilUsuario() {
  const [perfil, setPerfil] = useState(perfilInicial);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function cargarPerfil() {
      setCargando(true);
      setError("");

      try {
        const respuesta = await fetch(`${API_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) throw new Error(resultado.error || "No se pudo cargar el perfil.");
        setPerfil(resultado.perfil);
      } catch (errorCarga) {
        setError(errorCarga.message || "No se pudo cargar el perfil.");
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, []);

  const cambiarCampo = (event) => {
    const { name, value } = event.target;
    setPerfil((actual) => ({ ...actual, [name]: value }));
  };

  const guardarPerfil = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      const respuesta = await fetch(`${API_URL}/api/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify(perfil)
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || "No se pudo actualizar el perfil.");

      setPerfil(resultado.perfil);
      sessionStorage.setItem("userEmail", resultado.perfil.email);

      const usuarioGuardado = sessionStorage.getItem("user");
      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        const nombre = [resultado.perfil.nombre_1, resultado.perfil.nombre_2]
          .filter(Boolean)
          .join(" ");
        sessionStorage.setItem("user", JSON.stringify({
          ...usuario,
          nombre,
          email: resultado.perfil.email
        }));
      }

      setMensaje(resultado.mensaje || "Perfil actualizado correctamente.");
    } catch (errorGuardado) {
      setError(errorGuardado.message || "No se pudo actualizar el perfil.");
    } finally {
      setGuardando(false);
    }
  };

  const rol = sessionStorage.getItem("rol");
  const iniciales = `${perfil.nombre_1?.[0] || ""}${perfil.apellido_1?.[0] || ""}`.toUpperCase();
  const nombreCompleto = [perfil.nombre_1, perfil.nombre_2, perfil.apellido_1, perfil.apellido_2]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="perfil-usuario">
      <div className="perfil-usuario__contenedor">
        <header className="perfil-usuario__titulo">
          <div className="perfil-usuario__titulo-icono">
            <i className="bi bi-person-vcard-fill" aria-hidden="true"></i>
          </div>
          <div>
            <span>CUENTA PERSONAL</span>
            <h1>Mi perfil</h1>
            <p>
            Mantén actualizados tus datos de contacto y la información de tu cuenta.
            </p>
          </div>
        </header>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

        {cargando ? (
          <div className="perfil-usuario__cargando">
            <div className="spinner-border text-primary mx-auto" role="status" />
            <p className="text-secondary mt-3 mb-0">Cargando tus datos...</p>
          </div>
        ) : (
          <form className="perfil-usuario__tarjeta" onSubmit={guardarPerfil}>
            <div className="perfil-usuario__portada">
              <div>
                <span>PERFIL SERVIIAT</span>
                <h2>Tu información, siempre al día</h2>
                <p>Edita tus datos personales y de contacto.</p>
              </div>
              <i className="bi bi-shield-check" aria-hidden="true"></i>
            </div>

            <div className="perfil-usuario__contenido">
              <div className="perfil-usuario__identidad">
                <div className="perfil-usuario__avatar" aria-hidden="true">
                  {iniciales || <i className="bi bi-person-fill"></i>}
                </div>
                <div className="perfil-usuario__nombre">
                  <h3>{nombreCompleto || "Tu perfil"}</h3>
                  <span><i className="bi bi-patch-check-fill" aria-hidden="true"></i>{rol || "usuario"}</span>
                </div>
              </div>

              <div className="perfil-usuario__seccion">
                <div className="perfil-usuario__seccion-titulo">
                  <span><i className="bi bi-person-lines-fill" aria-hidden="true"></i></span>
                  <div>
                    <h3>Información personal</h3>
                    <p>Cuéntanos cómo debemos llamarte.</p>
                  </div>
                </div>

                <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="perfil-usuario__campo">
                    <label htmlFor="perfil-nombre-1">Primer nombre</label>
                    <div className="perfil-usuario__control">
                      <i className="bi bi-person" aria-hidden="true"></i>
                      <input
                        id="perfil-nombre-1"
                        className="form-control"
                        name="nombre_1"
                        value={perfil.nombre_1}
                        onChange={cambiarCampo}
                        maxLength={45}
                        autoComplete="given-name"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="perfil-usuario__campo">
                    <label htmlFor="perfil-nombre-2">Segundo nombre</label>
                    <div className="perfil-usuario__control">
                      <i className="bi bi-person" aria-hidden="true"></i>
                      <input
                        id="perfil-nombre-2"
                        className="form-control"
                        name="nombre_2"
                        value={perfil.nombre_2}
                        onChange={cambiarCampo}
                        maxLength={45}
                        autoComplete="additional-name"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="perfil-usuario__campo">
                    <label htmlFor="perfil-apellido-1">Primer apellido</label>
                    <div className="perfil-usuario__control">
                      <i className="bi bi-person-vcard" aria-hidden="true"></i>
                      <input
                        id="perfil-apellido-1"
                        className="form-control"
                        name="apellido_1"
                        value={perfil.apellido_1}
                        onChange={cambiarCampo}
                        maxLength={45}
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="perfil-usuario__campo">
                    <label htmlFor="perfil-apellido-2">Segundo apellido</label>
                    <div className="perfil-usuario__control">
                      <i className="bi bi-person-vcard" aria-hidden="true"></i>
                      <input
                        id="perfil-apellido-2"
                        className="form-control"
                        name="apellido_2"
                        value={perfil.apellido_2}
                        onChange={cambiarCampo}
                        maxLength={45}
                        autoComplete="additional-name"
                      />
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div className="perfil-usuario__seccion">
                <div className="perfil-usuario__seccion-titulo">
                  <span><i className="bi bi-chat-dots-fill" aria-hidden="true"></i></span>
                  <div>
                    <h3>Datos de contacto</h3>
                    <p>Usaremos esta información para comunicarnos contigo.</p>
                  </div>
                </div>

                <div className="row g-3">
                <div className="col-12">
                  <div className="perfil-usuario__campo">
                    <label htmlFor="perfil-email">Correo electrónico</label>
                    <div className="perfil-usuario__control">
                      <i className="bi bi-envelope" aria-hidden="true"></i>
                      <input
                        id="perfil-email"
                        className="form-control"
                        type="email"
                        name="email"
                        value={perfil.email}
                        onChange={cambiarCampo}
                        maxLength={100}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <small>Este correo también se usa para iniciar sesión.</small>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="perfil-usuario__campo">
                    <label htmlFor="perfil-telefono">Teléfono</label>
                    <div className="perfil-usuario__control">
                      <i className="bi bi-telephone" aria-hidden="true"></i>
                      <input
                        id="perfil-telefono"
                        className="form-control"
                        type="tel"
                        name="numero_tel"
                        value={perfil.numero_tel}
                        onChange={cambiarCampo}
                        maxLength={15}
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="perfil-usuario__campo">
                    <label htmlFor="perfil-direccion">Dirección</label>
                    <div className="perfil-usuario__control">
                      <i className="bi bi-geo-alt" aria-hidden="true"></i>
                      <input
                        id="perfil-direccion"
                        className="form-control"
                        name="direccion"
                        value={perfil.direccion}
                        onChange={cambiarCampo}
                        maxLength={150}
                        autoComplete="street-address"
                      />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            <div className="perfil-usuario__pie">
              <span><i className="bi bi-lock-fill" aria-hidden="true"></i> Tu información se mantiene protegida.</span>
              <button
                type="submit"
                className="perfil-usuario__guardar"
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle" aria-hidden="true"></i>
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default PerfilUsuario;
