CREATE DEFINER=`root`@`localhost` PROCEDURE `encriptar_todo`()
BEGIN
UPDATE usuario 
SET Contrasena = SHA2(Contrasena, 256);
END