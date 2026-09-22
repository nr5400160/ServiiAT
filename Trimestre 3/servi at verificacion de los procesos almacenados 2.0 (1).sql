-- verifiacion de procesos almaceandos 
SET SQL_SAFE_UPDATES = 0;

CALL encriptar_todo();

SET SQL_SAFE_UPDATES = 1;
select clave from usuario;

select * from orden_servicio;
CALL actualizar_estado_orden(1, 1);


CALL actualizar_precio_servicio(5, 50000);

select * from orden_servicio;
select * from ticket;