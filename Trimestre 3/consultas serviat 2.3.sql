use serviat;

--  ver solicitudes con nombre del cliente y equipo, solo las finalizadas
select s.id_solicitud, u.nombre_1, u.apellido_1, e.nombre_equipo
from solicitud s
inner join usuario u on s.usuario_id_cliente = u.id_usuario
inner join equipo e on s.id_equipo = e.id_equipo
where s.id_estado_solicitud = (
    select id_estado 
    from estado 
    where nombre_estado = 'Finalizado'
);
-- Mostrar órdenes de servicio con técnico y descripción de la solicitud
select  o.id_orden_servicio, o.precio_servicio, u.nombre_1, s.descripcion
from orden_servicio o
inner join usuario u on o.usuario_id_tecnico = u.id_usuario
inner join solicitud s on o.id_solicitud = s.id_solicitud
WHERE o.precio_servicio > (
    select avg(precio_servicio) 
    from orden_servicio
);
-- clientes que han hecho solicitudes de equipos industriales
select distinct u.nombre_1, u.apellido_1, r.nombre_rol
from usuario u
inner join roles r on u.id_roles = r.id_roles
inner join solicitud s on u.id_usuario = s.usuario_id_cliente
inner join equipo e on s.id_equipo = e.id_equipo
where e.id_categoria_equipo = (
    select id_categoria_equipo 
    from categoria_equipo 
    where nombre_categoria = 'Industrial'
)
and u.id_roles = 1;


--  técnicos que han trabajado en órdenes con precio mayor al promedio
select u.nombre_1, u.apellido_1
from usuario u
where u.id_usuario in (
    select o.usuario_id_tecnico
    from orden_servicio o
    where o.precio_servicio > (
        select avg(precio_servicio)
        from orden_servicio
    )
)
and u.id_roles = 2;

--  clientes que han hecho solicitudes con equipos de la categoría más usada
select u.nombre_1, u.apellido_1, r.nombre_rol, ce.nombre_categoria
from usuario u
inner join roles r on u.id_roles = r.id_roles
inner join solicitud s on u.id_usuario = s.usuario_id_cliente
inner join equipo e on s.id_equipo = e.id_equipo
inner join categoria_equipo ce on e.id_categoria_equipo = ce.id_categoria_equipo
where u.id_roles = 1
and ce.id_categoria_equipo = (
    select e2.id_categoria_equipo
    from solicitud s2
    inner join equipo e2 on s2.id_equipo = e2.id_equipo
    group by e2.id_categoria_equipo
    order by count(*) desc
    limit 1
);


-- servicios con pagos realizados

select u.nombre_1 as cliente,u2.nombre_1 as tecnico,t.metodo_pago,t.monto,o.precio_servicio,s.descripcion
from ticket t
inner join orden_servicio o on t.id_orden_servicio = o.id_orden_servicio
inner join solicitud s on o.id_solicitud = s.id_solicitud
inner join usuario u on s.usuario_id_cliente = u.id_usuario
inner join usuario u2 on o.usuario_id_tecnico = u2.id_usuario
inner join equipo e on s.id_equipo = e.id_equipo;


-- muestras las solicitudes de los clientes que todavia no han sido aprobadas 
select 
    u.id_usuario, 
    u.nombre_1, 
    u.apellido_1, 
    s.id_solicitud, 
    s.descripcion as detalle_solicitud
from usuario u
inner join solicitud s on u.id_usuario = s.usuario_id_cliente
where u.id_roles = 1
and not exists (
    select 1 
    from orden_servicio o
    where o.id_solicitud = s.id_solicitud
);


-- Muestra los clientes con sus solicitudes y la fecha en que las hicieron

select u.nombre_1,u.apellido_1,s.descripcion,s.fecha_solicitud
from usuario u
inner join solicitud s 
on u.id_usuario = s.usuario_id_cliente
where u.id_roles = 1;


-- Muestra las órdenes de servicio junto con el técnico encargado.


select o.id_orden_servicio,o.fecha_orden,o.precio_servicio,u.nombre_1 as tecnico,u.apellido_1
from orden_servicio o
inner join usuario u 
on o.usuario_id_tecnico = u.id_usuario;