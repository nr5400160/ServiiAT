-- verifiacion de procesos almaceandos 
SET SQL_SAFE_UPDATES = 0;

CALL encriptar_todo();

SET SQL_SAFE_UPDATES = 1;
select contrasena from usuario;

select * from orden_servicio;
CALL actualizar_estado_orden(1, 3);

CALL consultar_historial_cliente(34);

CALL actualizar_precio_servicio(5, 50.000);

select * from orden_servicio;
select * from ticket;