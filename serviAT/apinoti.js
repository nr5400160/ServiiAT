const { Server } = require("socket.io");

function configurarSocket(server) {

  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log("Usuario conectado");

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });

  });

  return io;
}

module.exports = configurarSocket;