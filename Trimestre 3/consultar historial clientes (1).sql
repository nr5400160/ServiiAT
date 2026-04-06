CREATE DEFINER=`root`@`localhost` PROCEDURE `consultar_historial_cliente`(
    IN p_id_usuario INT 
)
BEGIN
    SELECT u.Nombre_1, u.Apellido_1, s.id_solicitud, s.descripcion, s.Fecha_solicitud
    FROM usuario u
    JOIN solicitud s ON u.id_usuario = s.usuario_id_usuario_cliente
    WHERE u.id_usuario = p_id_usuario; 
END