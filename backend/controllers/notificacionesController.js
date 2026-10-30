import { transporter } from '../config/mailer.js';

export const enviarNotificacion = async (req, res) => {
  try {
    const { nombreCliente, email, estado, fecha_solicitud, hora, descripcion, nombre_equipo } = req.body;
    
    const baseHTML = (color, titulo, extra) => `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: ${color};">¡Hola, ${nombreCliente}!</h2>
        <p>${titulo}</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${color};">
          <h3 style="margin-top: 0;">Resumen de tu solicitud:</h3>
          <ul>
            <li><strong>Fecha programada:</strong> ${fecha_solicitud}</li>
            ${extra}
            <li><strong>Equipo a reparar:</strong> ${nombre_equipo}</li>
            <li><strong>Descripción:</strong> ${descripcion}</li>
          </ul>
        </div>
      </div>
    `;

    let mensaje = "";
    switch (estado) {
      case "Pendiente":
        mensaje = baseHTML("#1abc9c", "Hemos recibido tu solicitud de servicio. Nuestro equipo técnico la está evaluando.", "");
        break;
      case "En proceso":
        mensaje = baseHTML("#1abc9c", "Tu solicitud ha sido aprobada tras la revisión. Gracias por confiar en AR Asistencia Técnica.", `<li><strong>Hora programada:</strong> ${hora}</li>`);
        break;
      case "Cancelado":
        mensaje = baseHTML("#e74c3c", "Tu solicitud ha sido rechazada por la fecha o hora elegidas, vuelva a enviar la solicitud.", `<li><strong>Hora programada:</strong> ${hora}</li>`);
        break;
      case "Finalizado":
        mensaje = baseHTML("#1abc9c", "El servicio ha sido liquidado. Estamos a la espera de la confirmación de tu pago.", `<li><strong>Hora programada:</strong> ${hora}</li>`);
        break;
      default:
        mensaje = "Hay una actualización en tu solicitud de servicio.";
    }

    const mailOpciones = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `AR Asistencia Técnica: Tu solicitud está ${estado}`,
      html: mensaje
    };

    // Enviar correo usando tu transporter modularizado
    await transporter.sendMail(mailOpciones);
    res.status(200).json({ message: 'Alerta enviada a Gmail exitosamente' });

  } catch (error) {
    console.error("❌ Error al enviar el Gmail:", error);
    res.status(500).json({ error: 'Hubo un error al procesar el envío del correo' });
  }
};