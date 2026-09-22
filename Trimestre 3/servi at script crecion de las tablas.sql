DROP DATABASE IF EXISTS servi_at;
CREATE DATABASE servi_at;
USE servi_at;

CREATE TABLE Roles (
    id_roles INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_rol VARCHAR(45) NOT NULL,
    descripcion VARCHAR(150),
    estado ENUM('Activo','Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB;

CREATE TABLE Categoria_equipo (
    id_categoria_equipo INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_categoria ENUM('Industrial', 'Doméstico') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Estado_solicitud (
    id_estado_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    nombre_estado ENUM('Pendiente', 'En proceso', 'Finalizado', 'Cancelado') NOT NULL 
) ENGINE=InnoDB;

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_1 VARCHAR(45) NOT NULL,
    Nombre_2 VARCHAR(45),
    Apellido_1 VARCHAR(45) NOT NULL,
    Apellido_2 VARCHAR(45),
    Tipo_documento VARCHAR(20) NOT NULL,
    Documento CHAR(10) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    constraint chk_pass_length check (char_length(Contrasena) >=8),
    Fecha_nacimiento DATE NOT NULL,
    Roles_id_roles INT,
    FOREIGN KEY (Roles_id_roles) REFERENCES Roles(id_roles)
) ENGINE=InnoDB;

CREATE TABLE telefono (
    id_telefono INT PRIMARY KEY AUTO_INCREMENT,
    Numero VARCHAR(15) NOT NULL,
    Tipo VARCHAR(20),
    codigo_pais VARCHAR(10),
    usuario_id_usuario INT,
    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE Correo_electronico (
    id_correo_electronico INT PRIMARY KEY AUTO_INCREMENT,
    Direccion_email VARCHAR(100) UNIQUE NOT NULL,
    usuario_id_usuario INT,
    tipo VARCHAR(45), 
    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE Direccion (
    idDireccion INT PRIMARY KEY AUTO_INCREMENT,
    nombre_municipio VARCHAR(45),
    Nombre_departamento VARCHAR(45),
    Numero_via VARCHAR(45),
    Numero_cruce VARCHAR(45),
    Numero_placa VARCHAR(45),
    Direccion_completa VARCHAR(150) NOT NULL,
    usuario_id_usuario INT,
    FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE Equipo (
    id_equipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_equipo VARCHAR(45),
    Marca_equipo VARCHAR(45) NOT NULL,
    Modelo_equipo VARCHAR(45) NOT NULL,
    Categoria_equipo_id_categoria_equipo INT NOT NULL,
    FOREIGN KEY (Categoria_equipo_id_categoria_equipo) REFERENCES Categoria_equipo(id_categoria_equipo)
) ENGINE=InnoDB;

CREATE TABLE Solicitud (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    Nombre_usuario varchar(45) not null,
    Apellido_usuario varchar(45) not null,
    Descripcion TEXT NOT NULL,
    Fecha_solicitud DATE NOT NULL,
    Categoria_equipo varchar(45) not null,
    Direccion varchar(255) not null,
    Modelo_equipo varchar(255),
    Nombre_equipo varchar(45),
    Equipo_id_equipo INT UNIQUE NOT NULL,
    usuario_id_usuario_cliente INT NOT NULL,
    Estado_solicitud_id_estado_solicitud INT NOT NULL,
    usuario_id_usuario_admin INT,
    FOREIGN KEY (Equipo_id_equipo) REFERENCES Equipo(id_equipo),
    FOREIGN KEY (usuario_id_usuario_cliente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (Estado_solicitud_id_estado_solicitud) REFERENCES Estado_solicitud(id_estado_solicitud), 
    FOREIGN KEY (usuario_id_usuario_admin) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE Orden_servicio (
    id_orden_servicio INT PRIMARY KEY AUTO_INCREMENT,
    Solicitud_id_solicitud INT UNIQUE NOT NULL,
    Fecha_orden DATE NOT NULL,
    Hora_servicio TIME NOT NULL,
    Precio_servicio DECIMAL(10,2) NOT NULL,
    usuario_id_usuario_tecnico INT,
    id_estado_solicitud INT, -- Nueva columna para el estado de la orden
    CONSTRAINT chk_precio CHECK (Precio_servicio >= 0),
    CONSTRAINT chk_horario CHECK (Hora_servicio BETWEEN '06:00:00' AND '21:00:00'),
    CONSTRAINT chk_no_domingo CHECK (DAYOFWEEK(Fecha_orden) <> 1),
    FOREIGN KEY (Solicitud_id_solicitud) REFERENCES Solicitud(id_solicitud),
    FOREIGN KEY (usuario_id_usuario_tecnico) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_estado_solicitud) REFERENCES Estado_solicitud(id_estado_solicitud)
) ENGINE=InnoDB;

CREATE TABLE Ticket (
    idTicket INT PRIMARY KEY AUTO_INCREMENT,
    Orden_servicio_id_orden_servicio INT UNIQUE NOT NULL,
    pago_servicio DECIMAL(10,2) NOT NULL,
    Metodo_pago ENUM('Tarjeta', 'Transferencia', 'Efectivo') NOT NULL,
    Fecha_ticket DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pago CHECK (pago_servicio >= 0),
    FOREIGN KEY (Orden_servicio_id_orden_servicio) REFERENCES Orden_servicio(id_orden_servicio)
) ENGINE=InnoDB;
