import { supabase } from '../config/supabase.js';

const obtenerOrdenDelCliente = async (idSolicitud, idCliente) => {
  const { data: solicitud, error: solicitudError } = await supabase
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

  const { data: orden, error: ordenError } = await supabase
    .from('orden_servicio')
    .select('id_orden_servicio, id_solicitud, precio_servicio')
    .eq('id_solicitud', idSolicitud)
    .single();

  if (ordenError) throw ordenError;

  const { data: ticket, error: ticketError } = await supabase
    .from('ticket')
    .select('id_ticket, monto')
    .eq('id_orden_servicio', orden.id_orden_servicio)
    .maybeSingle();

  if (ticketError) throw ticketError;
  return { orden, ticket };
};

const obtenerConfiguracionPaypal = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const tasaCopUsd = Number(process.env.PAYPAL_COP_TO_USD);

  if (!clientId || !clientSecret || !Number.isFinite(tasaCopUsd) || tasaCopUsd <= 0) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    tasaCopUsd,
    apiUrl: process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'
  };
};

const obtenerTokenPaypal = async (configuracion) => {
  const respuesta = await fetch(`${configuracion.apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${configuracion.clientId}:${configuracion.clientSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.access_token) {
    console.error('PayPal no autorizó la solicitud:', resultado.error || respuesta.status);
    const error = new Error('No fue posible conectarse con PayPal.');
    error.status = 502;
    throw error;
  }

  return resultado.access_token;
};

const llamarApiPaypal = async (configuracion, ruta, metodo, cuerpo, requestId) => {
  const token = await obtenerTokenPaypal(configuracion);
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };

  if (requestId) headers['PayPal-Request-Id'] = requestId;

  const respuesta = await fetch(`${configuracion.apiUrl}${ruta}`, {
    method: metodo,
    headers,
    ...(cuerpo ? { body: JSON.stringify(cuerpo) } : {})
  });
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    console.error('PayPal rechazó la operación:', resultado.name || respuesta.status);
    const error = new Error('PayPal no pudo completar la operación.');
    error.status = 502;
    throw error;
  }

  return resultado;
};

const obtenerMontoPaypal = (precioCOP, tasaCopUsd) => (
  (precioCOP * tasaCopUsd).toFixed(2)
);

const validarOrdenPaypal = (ordenPaypal, ordenServicio, idSolicitud, montoUSD) => {
  const unidad = ordenPaypal.purchase_units?.[0];
  return unidad
    && unidad.reference_id === String(ordenServicio.id_orden_servicio)
    && unidad.custom_id === String(idSolicitud)
    && unidad.amount?.currency_code === 'USD'
    && unidad.amount?.value === montoUSD;
};

export const obtenerModoPago = (req, res) => {
  const configuracion = obtenerConfiguracionPaypal();
  if (!configuracion) return res.json({ modo: 'deshabilitado' });

  return res.json({
    modo: 'paypal',
    clientId: configuracion.clientId,
    moneda: 'USD',
    tasaCopUsd: configuracion.tasaCopUsd
  });
};

export const crearOrdenPaypal = async (req, res) => {
  const configuracion = obtenerConfiguracionPaypal();
  if (!configuracion) {
    return res.status(503).json({ error: 'PayPal no está configurado.' });
  }

  const idSolicitud = Number(req.params.id);
  if (!Number.isSafeInteger(idSolicitud) || idSolicitud <= 0) {
    return res.status(400).json({ error: 'La solicitud indicada no es válida.' });
  }

  try {
    const { orden, ticket } = await obtenerOrdenDelCliente(idSolicitud, req.auth.id);
    if (ticket) {
      return res.status(409).json({ error: 'Esta orden ya registra un pago.' });
    }

    const precioCOP = Number(orden.precio_servicio);
    if (!Number.isFinite(precioCOP) || precioCOP <= 0) {
      return res.status(409).json({ error: 'El técnico aún no ha definido un precio válido.' });
    }

    const montoUSD = obtenerMontoPaypal(precioCOP, configuracion.tasaCopUsd);
    if (Number(montoUSD) <= 0) {
      return res.status(409).json({ error: 'El precio convertido debe ser al menos USD 0.01.' });
    }

    const ordenPaypal = await llamarApiPaypal(
      configuracion,
      '/v2/checkout/orders',
      'POST',
      {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: String(orden.id_orden_servicio),
          custom_id: String(idSolicitud),
          description: `Servicio técnico solicitud ${idSolicitud}`,
          amount: { currency_code: 'USD', value: montoUSD }
        }],
        application_context: { shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' }
      }
    );

    if (!ordenPaypal.id || ordenPaypal.status !== 'CREATED') {
      throw new Error('PayPal no creó una orden válida.');
    }

    return res.json({ id: ordenPaypal.id });
  } catch (error) {
    console.error('Error al crear la orden de PayPal:', error);
    return res.status(error.status || 500).json({
      error: error.status ? error.message : 'No se pudo crear la orden de PayPal.'
    });
  }
};

export const capturarOrdenPaypal = async (req, res) => {
  const configuracion = obtenerConfiguracionPaypal();
  if (!configuracion) {
    return res.status(503).json({ error: 'PayPal no está configurado.' });
  }

  const idSolicitud = Number(req.params.id);
  const paypalOrderId = req.body?.orderID;
  if (!Number.isSafeInteger(idSolicitud) || idSolicitud <= 0
    || typeof paypalOrderId !== 'string' || !/^[A-Z0-9-]{1,64}$/i.test(paypalOrderId)) {
    return res.status(400).json({ error: 'La solicitud o la orden de PayPal no es válida.' });
  }

  try {
    const { orden, ticket } = await obtenerOrdenDelCliente(idSolicitud, req.auth.id);
    if (ticket) {
      return res.status(409).json({ error: 'Esta orden ya registra un pago.' });
    }

    const precioCOP = Number(orden.precio_servicio);
    if (!Number.isFinite(precioCOP) || precioCOP <= 0) {
      return res.status(409).json({ error: 'El técnico aún no ha definido un precio válido.' });
    }

    const montoUSD = obtenerMontoPaypal(precioCOP, configuracion.tasaCopUsd);
    const rutaOrden = `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`;
    const ordenPaypal = await llamarApiPaypal(configuracion, rutaOrden, 'GET');

    if (!validarOrdenPaypal(ordenPaypal, orden, idSolicitud, montoUSD)) {
      return res.status(409).json({ error: 'La orden de PayPal no coincide con el servicio y su valor.' });
    }

    const resultado = ordenPaypal.status === 'COMPLETED'
      ? ordenPaypal
      : await llamarApiPaypal(
        configuracion,
        `${rutaOrden}/capture`,
        'POST',
        {},
        `serviat-${orden.id_orden_servicio}-${paypalOrderId}`.slice(0, 108)
      );
    const captura = resultado.purchase_units?.[0]?.payments?.captures?.[0];

    if (resultado.status !== 'COMPLETED'
      || captura?.status !== 'COMPLETED'
      || captura.amount?.currency_code !== 'USD'
      || captura.amount?.value !== montoUSD) {
      return res.status(409).json({ error: 'PayPal no confirmó el pago completo esperado.' });
    }

    const { data: ticketExistente, error: consultaTicketError } = await supabase
      .from('ticket')
      .select('id_ticket, monto')
      .eq('id_orden_servicio', orden.id_orden_servicio)
      .maybeSingle();
    if (consultaTicketError) throw consultaTicketError;
    if (ticketExistente) {
      return res.json({
        estado: 'aprobado',
        monto: ticketExistente.monto,
        id_ticket: ticketExistente.id_ticket,
        metodo_pago: 'PayPal'
      });
    }

    const montoCOP = precioCOP.toFixed(2);
    const { data: ticketGenerado, error: ticketError } = await supabase
      .from('ticket')
      .insert([{
        id_orden_servicio: orden.id_orden_servicio,
        monto: montoCOP,
        pago_servicio: Number(montoCOP),
        metodo_pago: 'PayPal'
      }])
      .select('id_ticket')
      .single();

    if (ticketError) throw ticketError;

    return res.json({
      estado: 'aprobado',
      monto: montoCOP,
      monto_usd: montoUSD,
      id_ticket: ticketGenerado.id_ticket,
      metodo_pago: 'PayPal'
    });
  } catch (error) {
    console.error('Error al capturar el pago de PayPal:', error);
    return res.status(error.status || 500).json({
      error: error.status ? error.message : 'No se pudo confirmar el pago de PayPal.'
    });
  }
};
