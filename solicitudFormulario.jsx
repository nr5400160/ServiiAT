
import Swal from 'sweetalert2';
import { Cpu, Fan } from 'lucide-react'
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Formulario() {
    const [appliance, setAppliance] = useState("");
    const tecnicoNombre = "Fabio Alexander Rojas Lara";

    const navigate = useNavigate();


    const [datosValidar, setDatosValidar] = useState({
        equipo: "",
        categoria: "Industrial",
        nombreCliente: "",
        apellidoCliente: "",
        gmail: "",
        telefono: "",
        direccion: "",
        descripcion: "",
        modelo: ""

    });

    const [horaSeleccionada, setHoraSeleccionada] = useState("");
    const horarios = [
        "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
    ]


    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const reservado = [
        { id: 1, Date: new Date(2026, 3, 25) },
        { id: 2, Date: new Date(2026, 3, 31) }
    ]

    const fechasReservas = reservado.map(e => e.Date.toDateString());

    const bloquearFechas = ({ date, view }) => {
        if (view === 'month') {
            const esDomingo = date.getDay() === 0;
            return esDomingo || fechasReservas.includes(date.toDateString());
        }
        return false;
    };

    const manejarCambio = (e) => {
        setDatosValidar({
            ...datosValidar, [e.target.name]: e.target.value

            
        });
            setDatosValidar(nuevosDatos);
            localStorage.setItem("borradoFormulario",JSON.stringify(nuevosDatos));
    }

    const manejarEnvio = async (e) => {
        e.preventDefault();

        //constrcciones del objeto con los datos que se llenaron
        const datosFormulario = {
            servicio: appliance,
            equipo: datosValidar.equipo,
            categoria: datosValidar.categoria,
            fecha: fechaSeleccionada.toISOString().split('T')[0],
            hora: horaSeleccionada,
            nombreCliente: `${datosValidar.nombreCliente} ${datosValidar.apellidoCliente}`,
            telefono: datosValidar.telefono,
            direccion: datosValidar.direccion,
            gmail: datosValidar.gmail,
            descripcion: datosValidar.descripcion,
            modelo: datosValidar.modelo
        }

        localStorage.setItem("ultimaSolicitud",JSON.stringify(datosFormulario));

        try {
            const respuesta = await fetch("https://69d82a490576c93882592a63.mockapi.io/Formulrio", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(datosFormulario),
            });
            
            if (!respuesta.ok) {
                throw new Error("el servidor no respondio");
            }

            await Swal.fire({
                icon: "success",
                title: "Solicitud enviada",
                text: "La solicitud se envio correctamente",
            });
            navigate("/ValidarInformacion", { state: datosFormulario });
        } catch (error) {
            console.log("error en el fetch", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar la solicitud. Inténtalo de nuevo.",
            });
        }

        //pasar el objeto al siguiente paso

    }


    return (
        <section className="py-4">
            <div className="container">
                <div className="text-center mb-4">
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <form onSubmit={manejarEnvio} action="" className="p-4 shadow rounded-4 bg-white">
                                <h2 className="text-center py-4">Ingresa tu información</h2>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="" className="formlabel">Nombres *</label>
                                        <input type="text"
                                            name='nombreCliente'
                                            value={datosValidar.nombreCliente}
                                            onChange={manejarCambio}
                                            className="form-control"
                                            placeholder="Ingresa tú nombre"
                                            required />

                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="inputState" className="formlabel">Apellidos *</label>
                                        <input type="text"
                                            name='apellidoCliente'
                                            value={datosValidar.apellidoCliente}
                                            onChange={manejarCambio}
                                            className="form-control"
                                            placeholder="Ingresa tú apellido"
                                            required />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="" className="formlabel">Nombre del equipo</label>
                                        <input type="text"
                                            name='equipo'
                                            value={datosValidar.equipo}
                                            onChange={manejarCambio}
                                            className="form-control"
                                            placeholder="Ingresa nombre del equipo"
                                            required />

                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="inputState" className="formlabel">Categoria del equipo</label>
                                        <select id="inputState"
                                            name='categoria'
                                            value={datosValidar.categoria}
                                            onChange={manejarCambio}
                                            className="form-select"
                                            required>
                                            <option value="Domestico">Domestico</option>
                                            <option value="Industrial">Industrial</option>
                                        </select>

                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="" className="form-label text-secondary mb-3 d-block fw-medium">Tipo de servicio</label>
                                        <div className="row g-3">
                                            {[
                                                {
                                                    name: 'Reparación',
                                                    icon: Cpu,
                                                    gradient: 'linear-gradient(135deg, #2563eb, #4338ca)'
                                                },
                                                {
                                                    name: 'Instalación',
                                                    icon: Fan,
                                                    gradient: 'linear-gradient(135deg, #059669, #0f766e)'
                                                }
                                            ].map((tipo) => {
                                                const Icon = tipo.icon;
                                                const seleccion = appliance == tipo.name;

                                                return (
                                                    <div key={tipo.name} className="col-6">
                                                        <button type="button" required
                                                            onClick={() => setAppliance(tipo.name)}
                                                            className={`btn w-100 p-4 d-flex flex-column align-items-center justify-content-center gap-2 ${seleccion ? 'shadow-lg' : 'bg-white shadow-sm'
                                                                }`}
                                                            style={{
                                                                height: '150px',
                                                                borderRadius: '15px',
                                                                border: seleccion ? '2px solid #f87171' : '2px solid #e9ecef',
                                                                background: seleccion ? tipo.gradient : 'white',
                                                                color: seleccion ? 'white' : '#6c757d',
                                                                transform: seleccion ? 'scale(1.05)' : 'scale(1)',
                                                                transition: 'all 0.3s ease-in-out'
                                                            }}

                                                        >
                                                            <Icon size={40} strokeWidth={seleccion ? 2.5 : 1.5}
                                                                style={{ color: seleccion ? 'white' : '#adb5bd' }}
                                                            />
                                                            <span className={`fs-5 ${seleccion ? 'fw-bold' : 'fw-semibold'}`}>
                                                                <p className='align-items-center'>{tipo.name}</p>

                                                            </span>
                                                        </button>

                                                    </div>
                                                );
                                            })}

                                        </div>

                                    </div>


                                    <div className="col-md-6">
                                        <label htmlFor="" className="form-label">Descripcion del problema</label>
                                        <textarea name='descripcion'
                                            value={datosValidar.descripcion}
                                            onChange={manejarCambio}
                                            id="" className="form-control"
                                            rows="4"
                                            placeholder="Escribe la descripcion del servicio"
                                            required></textarea>
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="" className="formlabel">Modelo del equipo</label>
                                        <input type="text"
                                            name='modelo'
                                            value={datosValidar.modelo}
                                            onChange={manejarCambio}
                                            className="form-control"
                                            placeholder="Ingresa modelo del equipo (si lo conoce)"
                                        />

                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="" className="formlabel">telefono</label>
                                        <input type="tel"
                                            name='telefono'
                                            value={datosValidar.telefono}
                                            onChange={manejarCambio}
                                            onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                                            className="form-control"
                                            placeholder="Ingresa numero celular para contactarlo"
                                            required />

                                    </div>


                                    <div className="col-md-6">
                                        <label htmlFor="" className="formlabel">Dirección *</label>
                                        <input type="text"
                                            name='direccion'
                                            value={datosValidar.direccion}
                                            onChange={manejarCambio}
                                            className="form-control"
                                            placeholder="Dirección del servicio realizar"
                                            required />

                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="" className="formlabel">Correo electronico *</label>
                                        <input type="email"
                                            name='gmail'
                                            value={datosValidar.gmail}
                                            onChange={manejarCambio}
                                            className="form-control"
                                            placeholder="Correo electronico para contacto"
                                            required />

                                    </div>




                                    <label htmlFor="" className="formlabel">Seleccione la fecha</label>
                                    <div className="p-4 rounded-4 border shadow-sm mx-auto w-100 h-80"
                                        style={{ maxWidth: '600px', width: '100%', backgroundColor: '#f8fafa' }}
                                    >

                                        <Calendar
                                            onChange={setFechaSeleccionada}
                                            value={fechaSeleccionada}
                                            tileDisabled={bloquearFechas}
                                            minDate={new Date()}
                                            required
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-secondary">
                                            Fecha seleccionada: <strong>{fechaSeleccionada.toLocaleDateString()}</strong>
                                        </p>
                                        <div className="card-body text-center">
                                            <div className="alert border border-primary border-2 p-4 mb-4" style={{ backgroundColor: '#eff6ff', borderRadius: '0.75rem' }}>
                                                <p className="fw-bold mb-3  text-center text-primary">Técnico disponible</p>

                                                <ul className="list-unstyled mb-0" style={{ fontSize: '0.95rem' }}>
                                                    <li className="mb-2">Nombre: <br />{tecnicoNombre}</li>
                                                </ul>


                                            </div>
                                        </div>

                                    </div>

                                    <div className='mt-4'>
                                        <label htmlFor="" className='formlabel d block mb-3'>Seleccione la hora a realizar el servicio</label>
                                        <div className='row g-2'>
                                            {horarios.map((hora) => (
                                                <div key={hora} className="col-4 col-md-3">
                                                    <button
                                                        type="button" required
                                                        onClick={() => setHoraSeleccionada(hora)}
                                                        className={`btn w-100 py-2 border-2 ${horaSeleccionada === hora
                                                                ? 'btn-primary border-primary shadow'
                                                                : 'btn-outline-secondary bg-white'
                                                            }`}
                                                        style={{
                                                            borderRadius: '10px',
                                                            fontSize: '0.9rem',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {hora}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {horaSeleccionada && (
                                            <p className="mt-3 text-warning fw-bold">
                                                Servicio programado para el: {fechaSeleccionada.toLocaleDateString()} a la hora: {horaSeleccionada}
                                            </p>
                                        )}

                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type='submit'

                                            className="btn btn-continuar py-2 rounded-3 fw-bold shadow-sm"
                                            style={{ transition: 'transform 0.3s' }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                            <span style={{ color: 'rgb(246, 246, 246)' }}>Enviar solicitud</span>
                                        </button>
                                    </div>


                                </div>{/* Fin del row interno */}

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default Formulario

