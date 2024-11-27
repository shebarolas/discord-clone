import { NextApiResponseServerIo } from "@/types/type/socketType";
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      // Asegúrate de que soporte websocket y polling
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "ws://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    // Asignar la instancia de io al servidor para evitar inicializarla de nuevo
    res.socket.server.io = io;
    // Escuchar eventos de conexión
    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado:", socket.id);

      // Escuchar evento de desconexión
      socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
      });

      // Evento personalizado para probar la conexión
      socket.on("ping", () => {
        console.log("Ping recibido del cliente:", socket.id);
        socket.emit("pong");
      });
    });


  } else {
    console.log("Socket.IO ya estaba inicializado");
  }
  res.end();
};

export default ioHandler;