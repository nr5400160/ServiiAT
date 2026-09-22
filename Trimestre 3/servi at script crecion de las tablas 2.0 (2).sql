CREATE DATABASE serviat;
use serviat;
CREATE TABLE roles (
    id_roles INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(45) NOT NULL,
    descripcion VARCHAR(150),
    estado ENUM('Activo','Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB;

CREATE TABLE estado (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre_estado ENUM('Pendiente', 'En proceso', 'Finalizado', 'Cancelado') NOT NULL 
) ENGINE=InnoDB;

CREATE TABLE categoria_equipo (
    id_categoria_equipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria ENUM('Industrial', 'Doméstico') NOT NULL
) ENGINE=InnoDB;


CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_1 VARCHAR(45) NOT NULL,
    nombre_2 VARCHAR(45),
    apellido_1 VARCHAR(45) NOT NULL,
    apellido_2 VARCHAR(45),
    tipo_documento VARCHAR(20) NOT NULL,
    documento CHAR(10) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    id_roles INT NOT NULL,
    CONSTRAINT chk_pass_length CHECK (char_length(clave) >= 8),
    CONSTRAINT fk_usuario_roles FOREIGN KEY (id_roles) REFERENCES roles(id_roles)
) ENGINE=InnoDB;

CREATE TABLE direccion (
    id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    nombre_municipio VARCHAR(45),
    nombre_departamento VARCHAR(45),
    numero_via VARCHAR(45),
    numero_cruce VARCHAR(45),
    numero_placa VARCHAR(45),
    direccion_completa VARCHAR(150) NOT NULL,
    usuario_id_usuario INT NOT NULL,
    CONSTRAINT fk_direccion_usuario FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE telefono (
    id_telefono INT PRIMARY KEY AUTO_INCREMENT,
    codigo_pais VARCHAR(10),
    Tipo VARCHAR(20),
    Numero VARCHAR(15) NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_telefono_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE correo_electronico (
    id_correo_electronico INT PRIMARY KEY AUTO_INCREMENT,
    direccion_email VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(45),
    id_usuario INT NOT NULL,
    CONSTRAINT fk_correo_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE equipo (
    id_equipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre_equipo VARCHAR(45),
    marca_equipo VARCHAR(45) NOT NULL,
    modelo_equipo VARCHAR(45) NOT NULL,
    id_categoria_equipo INT NOT NULL,
    CONSTRAINT fk_equipo_categoria FOREIGN KEY (id_categoria_equipo) REFERENCES Categoria_equipo(id_categoria_equipo)
) ENGINE=InnoDB;

CREATE TABLE solicitud (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    fecha_solicitud DATE NOT NULL,
    descripcion TEXT NOT NULL,
    direccion_servicio VARCHAR(255) NOT NULL,
    usuario_id_administrador INT NOT NULL,
    usuario_id_cliente INT NOT NULL,
    id_estado_solicitud INT NOT NULL, 
    id_equipo INT NOT NULL,
    CONSTRAINT fk_solicitud_admin FOREIGN KEY (usuario_id_administrador) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_solicitud_cliente FOREIGN KEY (usuario_id_cliente) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_solicitud_estado FOREIGN KEY (id_estado_solicitud) REFERENCES estado(id_estado),
    CONSTRAINT fk_solicitud_equipo FOREIGN KEY (id_equipo) REFERENCES equipo(id_equipo)
) ENGINE=InnoDB;

CREATE TABLE orden_servicio (
    id_orden_servicio INT PRIMARY KEY AUTO_INCREMENT,
    fecha_orden DATE NOT NULL,
    hora_servicio TIME NOT NULL,
    precio_servicio DECIMAL(10,2) NOT NULL,
    id_estado_orden INT NOT NULL, 
    usuario_id_tecnico INT NOT NULL,
    id_solicitud INT UNIQUE NOT NULL,
    CONSTRAINT chk_precio CHECK (precio_servicio >= 0),
    CONSTRAINT chk_horario CHECK (hora_servicio BETWEEN '06:00:00' AND '21:00:00'),
    CONSTRAINT chk_no_domingo CHECK (DAYOFWEEK(fecha_orden) <> 1),
    CONSTRAINT fk_orden_estado FOREIGN KEY (id_estado_orden) REFERENCES estado(id_estado),
    CONSTRAINT fk_orden_tecnico FOREIGN KEY (usuario_id_tecnico) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_orden_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitud(id_solicitud) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ticket (
    id_ticket INT PRIMARY KEY AUTO_INCREMENT,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('Tarjeta', 'Transferencia', 'Efectivo') NOT NULL,
    fecha_ticket DATETIME DEFAULT CURRENT_TIMESTAMP,
    pago_servicio float,
    id_orden_servicio INT UNIQUE NOT NULL,
    CONSTRAINT chk_pago CHECK (monto >= 0),
    CONSTRAINT fk_ticket_orden FOREIGN KEY (id_orden_servicio) REFERENCES orden_servicio(id_orden_servicio) ON DELETE CASCADE
) ENGINE=InnoDB;
