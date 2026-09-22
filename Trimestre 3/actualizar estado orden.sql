CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_estado_orden`(
    IN p_id_orden INT, 
    IN p_id_estado INT -- Asegúrate de que aquí diga p_id_estado
)
BEGIN
    UPDATE Orden_servicio 
    SET id_estado_solicitud = p_id_estado 
    WHERE id_orden_servicio = p_id_orden;
END