-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: serviat
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria_equipo`
--

DROP TABLE IF EXISTS `categoria_equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_equipo` (
  `id_categoria_equipo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` enum('Industrial','Doméstico') NOT NULL,
  PRIMARY KEY (`id_categoria_equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_equipo`
--

LOCK TABLES `categoria_equipo` WRITE;
/*!40000 ALTER TABLE `categoria_equipo` DISABLE KEYS */;
INSERT INTO `categoria_equipo` VALUES (1,'Industrial'),(2,'Doméstico');
/*!40000 ALTER TABLE `categoria_equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `correo_electronico`
--

DROP TABLE IF EXISTS `correo_electronico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `correo_electronico` (
  `id_correo_electronico` int(11) NOT NULL AUTO_INCREMENT,
  `direccion_email` varchar(100) NOT NULL,
  `tipo` varchar(45) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_correo_electronico`),
  UNIQUE KEY `direccion_email` (`direccion_email`),
  KEY `fk_correo_usuario` (`id_usuario`),
  CONSTRAINT `fk_correo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `correo_electronico`
--

LOCK TABLES `correo_electronico` WRITE;
/*!40000 ALTER TABLE `correo_electronico` DISABLE KEYS */;
INSERT INTO `correo_electronico` VALUES (1,'Carlos.Gomez1@gmail.com','Personal',1),(2,'Maria.Lopez2@gmail.com','Personal',2),(3,'Juan.Martinez3@gmail.com','Personal',3),(4,'Jorge.Rojas4@gmail.com','Personal',4),(5,'Ana.Torres5@gmail.com','Personal',5),(6,'Pedro.Ramirez6@gmail.com','Personal',6),(7,'Elena.Morales7@gmail.com','Personal',7),(8,'Luis.Castro8@gmail.com','Personal',8),(9,'Marta.Peña9@gmail.com','Personal',9),(10,'Diego.Herrera10@gmail.com','Personal',10),(11,'Rosa.Jimenez11@gmail.com','Personal',11),(12,'Fabio.Rojas12@gmail.com','Personal',12),(13,'Gloria.Suarez13@gmail.com','Personal',13),(14,'Oscar.Pardo14@gmail.com','Personal',14),(15,'Sandra.Vaca15@gmail.com','Personal',15),(16,'Andres.Cano16@gmail.com','Personal',16),(17,'Paula.Vega17@gmail.com','Personal',17),(18,'Hugo.Duarte18@gmail.com','Personal',18),(19,'Diana.Rico19@gmail.com','Personal',19),(20,'Raul.Niño20@gmail.com','Personal',20),(21,'Nora.Melo21@gmail.com','Personal',21),(22,'Cesar.Ruiz22@gmail.com','Personal',22),(23,'Lina.Soto23@gmail.com','Personal',23),(24,'Ivan.Jara24@gmail.com','Personal',24),(25,'Olga.Bernal25@gmail.com','Personal',25),(26,'Mario.Uribe26@gmail.com','Personal',26),(27,'Sonia.Prada27@gmail.com','Personal',27),(28,'Jaime.Hoyos28@gmail.com','Personal',28),(29,'Clara.Borda29@gmail.com','Personal',29),(30,'Victor.Serna30@gmail.com','Personal',30),(31,'Angela.Falla31@gmail.com','Personal',31),(32,'Ruben.Lagos32@gmail.com','Personal',32),(33,'Berta.Tello33@gmail.com','Personal',33),(34,'Alvaro.Mejia34@gmail.com','Personal',34),(35,'Silvia.Arce35@gmail.com','Personal',35),(36,'Ramiro.Cisne36@gmail.com','Personal',36),(37,'Estela.Valle37@gmail.com','Personal',37),(38,'Nestor.Roca38@gmail.com','Personal',38),(39,'Irene.Sol39@gmail.com','Personal',39),(40,'Felipe.Paz40@gmail.com','Personal',40),(41,'Teresa.Cruz41@gmail.com','Personal',41),(42,'Wilson.Leal42@gmail.com','Personal',42),(43,'Nelly.Soto43@gmail.com','Personal',43),(44,'Dario.Rios44@gmail.com','Personal',44),(45,'Lucia.Vila45@gmail.com','Personal',45),(46,'Marcos.Duarte46@gmail.com','Personal',46),(47,'Cecilia.Mora47@gmail.com','Personal',47),(48,'Efrain.Gil48@gmail.com','Personal',48),(49,'Mabel.Daza49@gmail.com','Personal',49),(50,'Tomas.Pino50@gmail.com','Personal',50),(51,'maria@gmail.com','Personal',51),(52,'luna@gmail.com','Personal',52),(53,'tatis@gmail.com','Personal',57),(54,'tomasE@gmail.com','Personal',58),(55,'felipe@gmail.com','Personal',59),(56,'sara@gmail.com','Personal',60),(57,'santiago@gmail.com','Personal',61),(58,'andresF@gmail.com','Personal',62),(59,'mariana@gmail.com','Personal',63);
/*!40000 ALTER TABLE `correo_electronico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `id_direccion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_municipio` varchar(45) DEFAULT NULL,
  `nombre_departamento` varchar(45) DEFAULT NULL,
  `numero_via` varchar(45) DEFAULT NULL,
  `numero_cruce` varchar(45) DEFAULT NULL,
  `numero_placa` varchar(45) DEFAULT NULL,
  `direccion_completa` varchar(150) NOT NULL,
  `usuario_id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_direccion`),
  KEY `fk_direccion_usuario` (`usuario_id_usuario`),
  CONSTRAINT `fk_direccion_usuario` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
INSERT INTO `direccion` VALUES (1,'Soacha','Cundinamarca','Calle 88','65','86','Calle 35 #67-39, Soacha',1),(2,'Chía','Cundinamarca','Calle 53','38','61','Calle 53 #72-29, Chía',2),(3,'Soacha','Cundinamarca','Calle 95','24','59','Calle 24 #44-58, Soacha',3),(4,'Bogotá','Cundinamarca','Calle 28','14','34','Calle 83 #62-52, Bogotá',4),(5,'Soacha','Cundinamarca','Calle 37','32','22','Calle 3 #47-97, Soacha',5),(6,'Funza','Cundinamarca','Calle 15','68','60','Calle 54 #49-50, Funza',6),(7,'Bogotá','Cundinamarca','Calle 21','70','43','Calle 48 #33-17, Bogotá',7),(8,'Bogotá','Cundinamarca','Calle 97','62','33','Calle 62 #31-49, Bogotá',8),(9,'Chía','Cundinamarca','Calle 32','6','88','Calle 49 #76-94, Chía',9),(10,'Mosquera','Cundinamarca','Calle 18','7','55','Calle 83 #40-70, Mosquera',10),(11,'Bogotá','Cundinamarca','Calle 20','8','37','Calle 80 #43-22, Bogotá',11),(12,'Soacha','Cundinamarca','Calle 32','84','45','Calle 80 #35-23, Soacha',12),(13,'Soacha','Cundinamarca','Calle 77','32','12','Calle 60 #34-79, Soacha',13),(14,'Soacha','Cundinamarca','Calle 81','18','81','Calle 78 #79-83, Soacha',14),(15,'Chía','Cundinamarca','Calle 44','27','1','Calle 71 #88-7, Chía',15),(16,'Funza','Cundinamarca','Calle 10','38','81','Calle 77 #83-50, Funza',16),(17,'Funza','Cundinamarca','Calle 68','87','13','Calle 91 #15-51, Funza',17),(18,'Funza','Cundinamarca','Calle 95','81','70','Calle 13 #13-38, Funza',18),(19,'Mosquera','Cundinamarca','Calle 15','23','5','Calle 79 #90-51, Mosquera',19),(20,'Chía','Cundinamarca','Calle 20','95','80','Calle 58 #94-99, Chía',20),(21,'Funza','Cundinamarca','Calle 86','21','63','Calle 33 #43-13, Funza',21),(22,'Mosquera','Cundinamarca','Calle 84','71','66','Calle 48 #46-3, Mosquera',22),(23,'Bogotá','Cundinamarca','Calle 4','37','64','Calle 41 #25-98, Bogotá',23),(24,'Bogotá','Cundinamarca','Calle 75','28','29','Calle 80 #30-36, Bogotá',24),(25,'Mosquera','Cundinamarca','Calle 73','92','64','Calle 5 #21-96, Mosquera',25),(26,'Bogotá','Cundinamarca','Calle 36','16','52','Calle 71 #90-38, Bogotá',26),(27,'Mosquera','Cundinamarca','Calle 81','92','81','Calle 56 #16-86, Mosquera',27),(28,'Soacha','Cundinamarca','Calle 51','29','9','Calle 46 #15-23, Soacha',28),(29,'Soacha','Cundinamarca','Calle 97','93','25','Calle 58 #3-59, Soacha',29),(30,'Chía','Cundinamarca','Calle 34','11','74','Calle 14 #29-45, Chía',30),(31,'Soacha','Cundinamarca','Calle 7','89','36','Calle 38 #96-57, Soacha',31),(32,'Soacha','Cundinamarca','Calle 34','23','64','Calle 35 #1-85, Soacha',32),(33,'Chía','Cundinamarca','Calle 45','34','68','Calle 20 #44-81, Chía',33),(34,'Chía','Cundinamarca','Calle 68','70','21','Calle 82 #8-86, Chía',34),(35,'Chía','Cundinamarca','Calle 59','79','70','Calle 84 #40-24, Chía',35),(36,'Mosquera','Cundinamarca','Calle 87','75','80','Calle 58 #52-45, Mosquera',36),(37,'Soacha','Cundinamarca','Calle 99','76','60','Calle 89 #17-82, Soacha',37),(38,'Funza','Cundinamarca','Calle 82','3','3','Calle 26 #38-77, Funza',38),(39,'Soacha','Cundinamarca','Calle 61','56','8','Calle 27 #61-18, Soacha',39),(40,'Mosquera','Cundinamarca','Calle 3','90','42','Calle 18 #67-39, Mosquera',40),(41,'Soacha','Cundinamarca','Calle 2','56','91','Calle 19 #9-72, Soacha',41),(42,'Bogotá','Cundinamarca','Calle 81','81','73','Calle 30 #8-75, Bogotá',42),(43,'Soacha','Cundinamarca','Calle 97','95','8','Calle 27 #99-89, Soacha',43),(44,'Mosquera','Cundinamarca','Calle 7','31','86','Calle 91 #66-47, Mosquera',44),(45,'Mosquera','Cundinamarca','Calle 52','98','70','Calle 55 #93-14, Mosquera',45),(46,'Bogotá','Cundinamarca','Calle 92','40','53','Calle 26 #83-55, Bogotá',46),(47,'Mosquera','Cundinamarca','Calle 53','5','99','Calle 47 #3-85, Mosquera',47),(48,'Funza','Cundinamarca','Calle 43','92','41','Calle 16 #19-39, Funza',48),(49,'Bogotá','Cundinamarca','Calle 99','89','64','Calle 26 #79-40, Bogotá',49),(50,'Soacha','Cundinamarca','Calle 26','10','57','Calle 66 #41-45, Soacha',50),(51,NULL,NULL,NULL,NULL,NULL,'Avenida 200',51),(52,NULL,NULL,NULL,NULL,NULL,'Sena 30',52),(53,NULL,NULL,NULL,NULL,NULL,'Calle 100 autopista',57),(54,NULL,NULL,NULL,NULL,NULL,'Ciudad jardin',58),(55,NULL,NULL,NULL,NULL,NULL,'Calle 30 a sur',59),(56,NULL,NULL,NULL,NULL,NULL,'carrera 90',60),(57,NULL,NULL,NULL,NULL,NULL,'Ciudad jardin',61),(58,NULL,NULL,NULL,NULL,NULL,'calle 97',62),(59,NULL,NULL,NULL,NULL,NULL,'avenidas',63);
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo`
--

DROP TABLE IF EXISTS `equipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipo` (
  `id_equipo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_equipo` varchar(45) DEFAULT NULL,
  `marca_equipo` varchar(45) NOT NULL,
  `modelo_equipo` varchar(45) NOT NULL,
  `id_categoria_equipo` int(11) NOT NULL,
  PRIMARY KEY (`id_equipo`),
  KEY `fk_equipo_categoria` (`id_categoria_equipo`),
  CONSTRAINT `fk_equipo_categoria` FOREIGN KEY (`id_categoria_equipo`) REFERENCES `categoria_equipo` (`id_categoria_equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo`
--

LOCK TABLES `equipo` WRITE;
/*!40000 ALTER TABLE `equipo` DISABLE KEYS */;
INSERT INTO `equipo` VALUES (1,'Nevera','Samsung','RT38',2),(2,'Lavadora','Whirlpool','WWI16',2),(3,'Horno','LG','NeoChef',2),(4,'Aire Acondicionado','York','Inverter 12k',1),(5,'Estufa','Mabe','EM76',2),(6,'Secadora','Electrolux','EED10',2),(7,'Congelador','Indurama','CI-200',1),(8,'Microondas','Panasonic','NN-SB34',2),(9,'Calentador','Bosch','Therm 4000',2),(10,'Extractor','Haceb','Asento',1),(11,'Nevera','Samsung','RT45',2),(12,'Lavadora','LG','TurboWash',2),(13,'Aire Acondicionado','Carrier','Eco5',1),(14,'Horno Panadero','Pallomaro','P500',1),(15,'Licuadora Industrial','Vitamix','V100',1),(16,'Lavaplatos','Whirlpool','WDP70',2),(17,'Nevera Ejecutiva','Abba','NV100',2),(18,'Enfriador','Wonder','E250',1),(19,'Estufa Industrial','Guevara','EI4',1),(20,'Lavadora','Samsung','EcoBubble',2),(21,'Secadora','LG','SensorDry',2),(22,'Horno Pizzero','ChefMaster','PM20',1),(23,'Aire','Midea','Split18',1),(24,'Congelador Horizontal','Kalley','K-CH200',1),(25,'Calentador Electrico','Haceb','HEC10',2),(26,'Fritadora Industrial','FryMaster','F55',1),(27,'Nevera','Bosh','KDN',2),(28,'Lavadora','Haceb','Digital',2),(29,'Secadora','Whirlpool','WGD48',2),(30,'Aire','Panasonic','Inverter-V',1),(31,'Hielera','Manitowoc','M400',1),(32,'Estufa de Piso','Centrales','CP60',2),(33,'Lavavajillas','Bosch','Series 4',2),(34,'Campana Extractora','Teka','TL63',1),(35,'Minibar','Challenger','CR120',2),(36,'Horno Empotrable','Mabe','HME60',2),(37,'Aire Portatil','Honeywell','MO08',2),(38,'Lavadora Carga Frontal','Samsung','WF20',2),(39,'Nevera Side by Side','LG','InstaView',2),(40,'Cava de Vinos','Samsung','RW33',1),(41,'Termotanque','Rheem','RH50',2),(42,'Deshumidificador','Frigidaire','FAD30',1),(43,'Torre de Lavado','Whirlpool','WET40',2),(44,'Vitrina Enfriadora','Norex','V450',1),(45,'Plancha Industrial','SilverStar','ES90',1),(46,'Balanza Digital','Torrey','L-EQ',1),(47,'Picadora Carne','Braesi','BM12',1),(48,'Batidora Industrial','KitchenAid','KSM7',1),(49,'Asador de Pollos','Indupanes','AP8',1),(50,'Exprimidor de Jugos','Zummo','Z14',1),(51,'Horno','No especificada','ninguno',2),(52,'Estufa','No especificada','Mabe',2),(53,'Licuadora','No especificada','Uperr',2),(54,'Nevera ','No especificada','mabe',2),(55,'Microondas','No especificada','horno',2),(56,'Estufa','No especificada','Mabe',2);
/*!40000 ALTER TABLE `equipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado`
--

DROP TABLE IF EXISTS `estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado` (
  `id_estado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estado` enum('Pendiente','En proceso','Finalizado','Cancelado') NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado`
--

LOCK TABLES `estado` WRITE;
/*!40000 ALTER TABLE `estado` DISABLE KEYS */;
INSERT INTO `estado` VALUES (1,'Pendiente'),(2,'En proceso'),(3,'Finalizado'),(4,'Cancelado');
/*!40000 ALTER TABLE `estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_servicio`
--

DROP TABLE IF EXISTS `orden_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden_servicio` (
  `id_orden_servicio` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_orden` date NOT NULL,
  `hora_servicio` time NOT NULL,
  `precio_servicio` decimal(10,2) NOT NULL,
  `id_estado_orden` int(11) NOT NULL,
  `usuario_id_tecnico` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  PRIMARY KEY (`id_orden_servicio`),
  UNIQUE KEY `id_solicitud` (`id_solicitud`),
  KEY `fk_orden_estado` (`id_estado_orden`),
  KEY `fk_orden_tecnico` (`usuario_id_tecnico`),
  CONSTRAINT `fk_orden_estado` FOREIGN KEY (`id_estado_orden`) REFERENCES `estado` (`id_estado`),
  CONSTRAINT `fk_orden_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud` (`id_solicitud`) ON DELETE CASCADE,
  CONSTRAINT `fk_orden_tecnico` FOREIGN KEY (`usuario_id_tecnico`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `chk_precio` CHECK (`precio_servicio` >= 0),
  CONSTRAINT `chk_horario` CHECK (`hora_servicio` between '06:00:00' and '21:00:00'),
  CONSTRAINT `chk_no_domingo` CHECK (dayofweek(`fecha_orden`) <> 1)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_servicio`
--

LOCK TABLES `orden_servicio` WRITE;
/*!40000 ALTER TABLE `orden_servicio` DISABLE KEYS */;
/*!40000 ALTER TABLE `orden_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_roles` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(45) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  PRIMARY KEY (`id_roles`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Cliente','Usuario que solicita servicios','Activo'),(2,'Tecnico','Personal encargado de reparaciones','Activo'),(3,'Administrador','Gestióna las solicitudes y gestiona los tecnicos','Activo');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud`
--

DROP TABLE IF EXISTS `solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud` (
  `id_solicitud` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_solicitud` date NOT NULL,
  `descripcion` text NOT NULL,
  `direccion_servicio` varchar(255) NOT NULL,
  `usuario_id_administrador` int(11) NOT NULL,
  `usuario_id_cliente` int(11) NOT NULL,
  `id_estado_solicitud` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `usuario_id_tecnico` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `fk_solicitud_admin` (`usuario_id_administrador`),
  KEY `fk_solicitud_cliente` (`usuario_id_cliente`),
  KEY `fk_solicitud_estado` (`id_estado_solicitud`),
  KEY `fk_solicitud_equipo` (`id_equipo`),
  KEY `fk_solicitud_tecnico` (`usuario_id_tecnico`),
  CONSTRAINT `fk_solicitud_admin` FOREIGN KEY (`usuario_id_administrador`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_solicitud_cliente` FOREIGN KEY (`usuario_id_cliente`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `fk_solicitud_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipo` (`id_equipo`),
  CONSTRAINT `fk_solicitud_estado` FOREIGN KEY (`id_estado_solicitud`) REFERENCES `estado` (`id_estado`),
  CONSTRAINT `fk_solicitud_tecnico` FOREIGN KEY (`usuario_id_tecnico`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud`
--

LOCK TABLES `solicitud` WRITE;
/*!40000 ALTER TABLE `solicitud` DISABLE KEYS */;
INSERT INTO `solicitud` VALUES (43,'2026-06-20','Fallos boton','carrera 27 a sur ',1,59,2,53,1),(44,'2026-06-26','Daños al enfriar','Barrio La victoria',1,62,2,54,1),(45,'2026-06-23','Daños fisicos','avenida 200',1,63,2,55,1),(46,'2026-07-23','Estufa nueva','Calle 27 a sur',1,63,2,56,1);
/*!40000 ALTER TABLE `solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefono`
--

DROP TABLE IF EXISTS `telefono`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefono` (
  `id_telefono` int(11) NOT NULL AUTO_INCREMENT,
  `codigo_pais` varchar(10) DEFAULT NULL,
  `Tipo` varchar(20) DEFAULT NULL,
  `Numero` varchar(15) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_telefono`),
  KEY `fk_telefono_usuario` (`id_usuario`),
  CONSTRAINT `fk_telefono_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefono`
--

LOCK TABLES `telefono` WRITE;
/*!40000 ALTER TABLE `telefono` DISABLE KEYS */;
INSERT INTO `telefono` VALUES (1,'3150000001','Celular','+57',1),(2,'3150000002','Celular','+57',2),(3,'3150000005','Celular','+57',5),(4,'3150000007','Celular','+57',7),(5,'3150000008','Celular','+57',8),(6,'3150000009','Celular','+57',9),(7,'3150000010','Celular','+57',10),(8,'3150000013','Celular','+57',13),(9,'3150000014','Celular','+57',14),(10,'3150000016','Celular','+57',16),(11,'3150000017','Celular','+57',17),(12,'3150000018','Celular','+57',18),(13,'3150000019','Celular','+57',19),(14,'3150000021','Celular','+57',21),(15,'3150000022','Celular','+57',22),(16,'3150000023','Celular','+57',23),(17,'3150000025','Celular','+57',25),(18,'3150000026','Celular','+57',26),(19,'3150000027','Celular','+57',27),(20,'3150000028','Celular','+57',28),(21,'3150000030','Celular','+57',30),(22,'3150000031','Celular','+57',31),(23,'3150000032','Celular','+57',32),(24,'3150000033','Celular','+57',33),(25,'3150000035','Celular','+57',35),(26,'3150000036','Celular','+57',36),(27,'3150000037','Celular','+57',37),(28,'3150000038','Celular','+57',38),(29,'3150000040','Celular','+57',40),(30,'3150000041','Celular','+57',41),(31,'3150000042','Celular','+57',42),(32,'3150000044','Celular','+57',44),(33,'3150000045','Celular','+57',45),(34,'3150000046','Celular','+57',46),(35,'3150000047','Celular','+57',47),(36,'3150000049','Celular','+57',49),(37,'3150000050','Celular','+57',50),(38,'3150000004','Celular','+57',4),(39,'3150000006','Celular','+57',6),(40,'3150000011','Celular','+57',11),(41,'3150000015','Celular','+57',15),(42,'3150000020','Celular','+57',20),(43,'3150000024','Celular','+57',24),(44,'3150000029','Celular','+57',29),(45,'3150000034','Celular','+57',34),(46,'3150000039','Celular','+57',39),(47,'3150000043','Celular','+57',43),(48,'3150000048','Celular','+57',48),(49,'3150000003','Celular','+57',3),(50,'3150000012','Celular','+57',12),(51,NULL,'Celular','398563785',51),(52,NULL,'Celular','321922975',52),(53,NULL,'Celular','324285856',57),(54,NULL,'Celular','45678963',58),(55,NULL,'Celular','32158568',59),(56,NULL,'Celular','358985456',60),(57,NULL,'Celular','25687568',61),(58,NULL,'Celular','23874578',62),(59,NULL,'Celular','3658914',63);
/*!40000 ALTER TABLE `telefono` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `id_ticket` int(11) NOT NULL AUTO_INCREMENT,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Tarjeta','Transferencia','Efectivo') NOT NULL,
  `fecha_ticket` datetime DEFAULT current_timestamp(),
  `pago_servicio` float DEFAULT NULL,
  `id_orden_servicio` int(11) NOT NULL,
  PRIMARY KEY (`id_ticket`),
  UNIQUE KEY `id_orden_servicio` (`id_orden_servicio`),
  CONSTRAINT `fk_ticket_orden` FOREIGN KEY (`id_orden_servicio`) REFERENCES `orden_servicio` (`id_orden_servicio`) ON DELETE CASCADE,
  CONSTRAINT `chk_pago` CHECK (`monto` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_1` varchar(45) NOT NULL,
  `nombre_2` varchar(45) DEFAULT NULL,
  `apellido_1` varchar(45) NOT NULL,
  `apellido_2` varchar(45) DEFAULT NULL,
  `tipo_documento` varchar(20) NOT NULL,
  `documento` char(10) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `id_roles` int(11) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento` (`documento`),
  KEY `fk_usuario_roles` (`id_roles`),
  CONSTRAINT `fk_usuario_roles` FOREIGN KEY (`id_roles`) REFERENCES `roles` (`id_roles`),
  CONSTRAINT `chk_pass_length` CHECK (char_length(`clave`) >= 8)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Carlos','Alberto','Gomez','Perez','CC','1000000051','C.Gomez1985*','1985-05-12',1),(2,'Maria','Fernanda','Lopez','Rodriguez','CC','1000000052','M.Lopez1990*','1990-08-22',1),(3,'Juan','David','Martinez','Sosa','CC','1000000053','J.Martinez1988*','1988-03-15',3),(4,'Jorge','Luis','Rojas','Lara','CC','1000000054','J.Rojas1992*','1992-01-10',2),(5,'Ana','Lucia','Torres','Castro','CC','1000000055','A.Torres1995*','1995-12-05',1),(6,'Pedro','Jose','Ramirez','Vargas','CC','1000000056','P.Ramirez1982*','1982-07-18',2),(7,'Elena','Beatriz','Morales','Rios','CC','1000000057','E.Morales1994*','1994-04-25',1),(8,'Luis','Eduardo','Castro','Ortiz','CC','1000000058','L.Castro1987*','1987-11-30',1),(9,'Marta','Cecilia','Peña','Guerra','CC','1000000059','M.Pena1991*','1991-09-14',1),(10,'Diego','Andres','Herrera','Blanco','CC','1000000060','D.Herrera1989*','1989-02-20',1),(11,'Rosa','Isabel','Jimenez','Mendez','CC','1000000061','R.Jimenez1993*','1993-06-10',2),(12,'Fabio','Alex','Rojas','Hernandez','CC','1000000062','F.Rojas1980*','1980-01-05',3),(13,'Gloria','Patricia','Suarez','Daza','CC','1000000063','G.Suarez1986*','1986-03-22',1),(14,'Oscar','Ivan','Pardo','Leal','CC','1000000064','O.Pardo1990*','1990-10-12',1),(15,'Sandra','Milena','Vaca','Bello','CC','1000000065','S.Vaca1992*','1992-05-15',2),(16,'Andres','Felipe','Cano','Mora','CC','1000000066','A.Cano1995*','1995-08-08',1),(17,'Paula','Andrea','Vega','Luna','CC','1000000067','P.Vega1998*','1998-12-24',1),(18,'Hugo','Hernan','Duarte','Sanz','CC','1000000068','H.Duarte1984*','1984-04-04',1),(19,'Diana','Marcela','Rico','Ossa','CC','1000000069','D.Rico1991*','1991-07-07',1),(20,'Raul','Alfonso','Niño','Rey','CC','1000000070','R.Nino1983*','1983-09-09',2),(21,'Nora','Esperanza','Melo','Polo','CC','1000000071','N.Melo1979*','1979-11-11',1),(22,'Cesar','Augusto','Ruiz','Toro','CC','1000000072','C.Ruiz1988*','1988-02-02',1),(23,'Lina','Maria','Soto','Villa','CC','1000000073','L.Soto1996*','1996-06-06',1),(24,'Ivan','Ramiro','Jara','Gala','CC','1000000074','I.Jara1990*','1990-10-10',2),(25,'Olga','Lucia','Bernal','Cely','CC','1000000075','O.Bernal1985*','1985-05-05',1),(26,'Mario','Alberto','Uribe','Saenz','CC','1000000076','M.Uribe1982*','1982-12-12',1),(27,'Sonia','Rocio','Prada','Mier','CC','1000000077','S.Prada1994*','1994-03-03',1),(28,'Jaime','Arturo','Hoyos','Real','CC','1000000078','J.Hoyos1987*','1987-08-08',1),(29,'Clara','Ines','Borda','Sosa','CC','1000000079','C.Borda1992*','1992-09-09',2),(30,'Victor','Manuel','Serna','Baeza','CC','1000000080','V.Serna1989*','1989-01-01',1),(31,'Angela','Maria','Falla','Nova','CC','1000000081','A.Falla1995*','1995-04-14',1),(32,'Ruben','Dario','Lagos','Pava','CC','1000000082','R.Lagos1983*','1983-02-28',1),(33,'Berta','Alicia','Tello','Lira','CC','1000000083','B.Tello1981*','1981-06-19',1),(34,'Alvaro','Jose','Mejia','Caro','CC','1000000084','A.Mejia1990*','1990-11-25',2),(35,'Silvia','Rosa','Arce','Mina','CC','1000000085','S.Arce1997*','1997-05-30',1),(36,'Ramiro','Leon','Cisne','Loro','CC','1000000086','R.Cisne1986*','1986-12-01',1),(37,'Estela','Maris','Valle','Lago','CC','1000000087','E.Valle1992*','1992-08-15',1),(38,'Nestor','Fabio','Roca','Mar','CC','1000000088','N.Roca1988*','1988-10-20',1),(39,'Irene','Paola','Sol','Luna','CC','1000000089','I.Sol1994*','1994-01-10',2),(40,'Felipe','Santi','Paz','Amor','CC','1000000090','F.Paz1999*','1999-03-22',1),(41,'Teresa','Ines','Cruz','Santo','CC','1000000091','T.Cruz1980*','1980-05-18',1),(42,'Wilson','Jair','Leal','Fiel','CC','1000000092','W.Leal1985*','1985-07-12',1),(43,'Nelly','Amparo','Soto','Bajo','CC','1000000093','N.Soto1991*','1991-09-09',2),(44,'Dario','Camilo','Rios','Montes','CC','1000000094','D.Rios1987*','1987-12-05',1),(45,'Lucia','Elena','Vila','Casa','CC','1000000095','L.Vila1996*','1996-02-14',1),(46,'Marcos','Antonio','Duarte','Sanz','CC','1000000096','M.Duarte1984*','1984-11-20',1),(47,'Cecilia','Ines','Mora','Baya','CC','1000000097','C.Mora1982*','1982-10-10',1),(48,'Efrain','Jose','Gil','Lata','CC','1000000098','E.Gil1989*','1989-08-08',2),(49,'Mabel','Rocio','Daza','Rico','CC','1000000099','M.Daza1993*','1993-04-04',1),(50,'Tomas','Enrique','Pino','Rama','CC','1000000100','T.Pino1998*','1998-01-01',1),(51,'maria','hernadez','mesa','','CC','789654123','$2b$10$T9K1OMRboH7YPMH2wFIQW.2E0QU9v2eJXa5I56a04.o9/6A1AlEUy','2003-05-10',1),(52,'Luna','sofia','martinez','','CC','1021314247','$2b$10$qQW9zX0dMV/ChHwpXnjDiuflIrFsnakjHGNjtvqdhyBgFz7f3RyUO','1980-02-06',3),(57,'Paula','alejandra','mesa','','CC','154668952','$2b$10$bRBq/uWkMr7T6qggZA4gUOJmjOTTsbbjcI3ywrGVLhTFNd5eKnxBi','1983-04-23',3),(58,'tomas','eduardo','perez','londoño','CC','58963589','$2b$10$UwP60kGILDYxjPkcY9J9AeO/tveIkBlEkaxtqdxs8vez0LiDeruZW','1981-05-16',1),(59,'Felipe','Ruiz','Diaz','','CC','5896358','$2b$10$fYF22yIp/Z25gJp1LCVBnuio6ivLHcq5QQnMol9B4jZ8BWVnLckjq','1981-01-08',1),(60,'sara','malaver','rubio','lopez','CC','3214258','$2b$10$3NwESl0LrYm.pHMOPpkPBeClr2YQ91llPyC/RF.4hz1otZ3tp/G5i','1996-02-05',2),(61,'Santiago','prieto','ortiz','','CC','89657745','$2b$10$THVDuElejEk4sskIHnUo9.96Tm0o.jywJjODeovzaCPrilhpyX2c.','1985-09-08',2),(62,'Andres','felipe','mendoza','tique','CC','456897253','$2b$10$.zzDGRPDvaX7LWvyP1VDieG1fh6pVVtJWb8LBob2ZXxQjr1Z0FHm6','1999-06-02',1),(63,'mariana','perez','mesa','','CC','963235552','$2b$10$MRMz.lmgvHhvoMSMwbLPq.tCGbPqzQOLFmt4TwtRo/OUj3X.9LrOy','2002-05-21',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-21 18:46:14
