USE servi_at;

-- consultas 
-- mostrar el estado de las solicitudes
select s.id_solicitud,s.Nombre_usuario,s.descripcion, e.nombre_estado
from solicitud s 
inner join estado_solicitud e on e.id_estado_solicitud=s.Estado_solicitud_id_estado_solicitud;

-- Consulta para ver solicitudes con cada cliente
SELECT s.id_solicitud, u.Nombre_1, u.Apellido_1, s.Descripcion
FROM Solicitud s
INNER JOIN usuario u
ON s.usuario_id_usuario_cliente = u.id_usuario;

-- Consulta para ver solicitudes aprobadas
SELECT
u.Nombre_1,
u.Apellido_1,
s.id_solicitud,
s.Descripcion,
e.nombre_estado
FROM Solicitud s
INNER JOIN usuario u
   ON s.usuario_id_usuario_cliente = u.id_usuario
INNER JOIN estado_solicitud e
   ON s.Estado_solicitud_id_estado_solicitud = e.id_estado_solicitud
WHERE e.nombre_estado = 'Finalizado';

-- Regla Cada usuario tiene un rol
SELECT u.Nombre_1, u.Apellido_1, r.Nombre_rol
FROM usuario u
INNER JOIN Roles r
ON u.Roles_id_roles = r.id_roles;

-- mostrar el nombre de los equipos y la categoria 
select c.Nombre_categoria, e.nombre_equipo from categoria_equipo c
inner join equipo e on c.id_categoria_equipo = e.Categoria_equipo_id_categoria_equipo; 


-- costos mayores al promedio

select idticket,fecha_ticket,pago_servicio from ticket
where pago_servicio >= (select avg(pago_servicio) as 'promedio' from ticket);

-- mostrar tecnicos con ordenes de servicios activas
select Nombre_1,Apellido_1 from usuario
where id_usuario in (select distinct usuario_id_usuario_tecnico from orden_servicio);

-- Correos repetidos
-- El usuario no se puede registrar en el mismo correo mas de una vez
SELECT Direccion_email, COUNT(*) AS cantidad
FROM correo_electronico
GROUP BY Direccion_email
HAVING COUNT(*) > 1;



-- muestra los nombres de los tecnicos junto al total de ingresos generados por servicio 
SELECT 
    u.Nombre_1, 
    u.Apellido_1,
    (SELECT SUM(t.pago_servicio) 
     FROM Ticket t 
     JOIN Orden_servicio os ON t.Orden_servicio_id_orden_servicio = os.id_orden_servicio 
     WHERE os.usuario_id_usuario_tecnico = u.id_usuario) AS Total_Recaudado
FROM usuario u
WHERE u.Roles_id_roles = 2; 


-- filtrar todas la solicitudes de equipos industriales 

SELECT 
    id_solicitud, 
    Nombre_equipo, 
    Descripcion 
FROM Solicitud
WHERE Equipo_id_equipo IN (
    SELECT id_equipo 
    FROM Equipo 
    WHERE Categoria_equipo_id_categoria_equipo = (
        SELECT id_categoria_equipo 
        FROM Categoria_equipo 
        WHERE Nombre_categoria = 'Industrial'
    )
);



-- muestras las solicitudes de los clientes que todavia no han sido aprobadas 
SELECT 
    u.id_usuario, 
    u.Nombre_1, 
    u.Apellido_1, 
    s.id_solicitud, 
    s.Descripcion AS Detalle_Solicitud
FROM usuario u
JOIN Solicitud s ON u.id_usuario = s.usuario_id_usuario_cliente
WHERE NOT EXISTS (
    SELECT 1 
    FROM Orden_servicio os 
    WHERE os.Solicitud_id_solicitud = s.id_solicitud
);