CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_precio_servicio`(
    IN id_orden_servicio INT,       
    IN pago_servicio DECIMAL(10,2)  
)
BEGIN
    UPDATE ticket 

    SET ticket.pago_servicio = pago_servicio 
    WHERE ticket.Orden_servicio_id_orden_servicio = id_orden_servicio;
END