import { getSupabaseAdmin } from '../config/supabaseAdmin.js';

const obtenerOrdenDelCliente = async (idSolicitud, idCliente) => {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: solicitud, error: solicitudError } = await supabaseAdmin
    .from('solicitud')
    .select('id_solicitud, usuario_id_cliente')
    .eq('id_solicitud', idSolicitud)
    .single();

  if (solicitudError) throw solicitudError;
  if (Number(solicitud.usuario_id_cliente) !== Number(idCliente)) {
    const error = new Error('La solicitud no pertenece a este cliente.');
    error.status = 403;
    throw error;
  }

  const { data: orden, error: ordenError } = await supabaseAdmin
    .from('orden_servicio')
    .select('id_orden_servicio, id_solicitud, precio_servicio')
    .eq('id_solicitud', idSolicitud)
    .single();

  if (ordenError) throw ordenError;

  const { data: ticket, error: ticketError } = await supabaseAdmin
    .from('ticket')
    .select('id_ticket, monto')
    .eq('id_orden_servicio', orden.id_orden_servicio)
    .maybeSingle();

  if (ticketError) throw ticketError;
  return { orden, ticket };
};

const modoDemoHabilitado = () => (
  process.env.PAYMENT_MODE === 'demo' && process.env.NODE_ENV !== 'production'
);

export const obtenerModoPago = (req, res) => {
  res.json({ modo: modoDemoHabilitado() ? 'demo' : 'deshabilitado' });
};

export const crearPagoDemo = async (req, res) => {
  if (!modoDemoHabilitado()) {
    return res.status(403).json({ error: 'El modo de demostración no está habilitado.' });
  }

  const idSolicitud = Number(req.params.id);
  if (!Number.isSafeInteger(idSolicitud) || idSolicitud <= 0) {
    return res.status(400).json({ error: 'La solicitud indicada no es válida.' });
  }

  const metodoPago = req.body?.metodo_pago;
  if (!['Tarjeta', 'Transferencia', 'Efectivo'].includes(metodoPago)) {
    return res.status(400).json({ error: 'Selecciona un método de pago válido.' });
  }

  try {
    const { orden, ticket } = await obtenerOrdenDelCliente(idSolicitud, req.auth.id);

    if (ticket) {
      return res.status(409).json({ error: 'Esta orden ya registra un pago.' });
    }

    const precio = Number(orden.precio_servicio);
    if (!Number.isFinite(precio) || precio <= 0) {
      return res.status(409).json({ error: 'El técnico aún no ha definido un precio válido.' });
    }

    const monto = precio.toFixed(2);
    const { data: ticketGenerado, error: ticketError } = await getSupabaseAdmin()
      .from('ticket')
      .insert([{
        id_orden_servicio: orden.id_orden_servicio,
        monto,
        pago_servicio: Number(monto),
        metodo_pago: metodoPago
      }])
      .select('id_ticket')
      .single();

    if (ticketError) throw ticketError;

    return res.json({
      estado: 'aprobado',
      simulado: true,
      metodo_pago: metodoPago,
      monto,
      id_ticket: ticketGenerado.id_ticket,
      mensaje: 'Pago de demostración aprobado y ticket generado. No se procesó un cobro real.'
    });
  } catch (error) {
    console.error('Error al registrar el pago de demostración:', error);
    return res.status(error.status || 500).json({
      error: error.status ? error.message : 'No se pudo registrar el pago de demostración.'
    });
  }
};

