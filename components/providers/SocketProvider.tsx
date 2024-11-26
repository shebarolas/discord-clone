"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
};

// Crear un contexto con valores por defecto
const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

// Custom Hook para usar el contexto
export const useSocket = () =>  useContext(SocketContext);


// Provider para envolver la aplicación
const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const socketInstance = ClientIO (process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: true,
            transports: ["polling"],
        })
        socketInstance.on("connect", () => {
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        // Cleanup al desmontar el componente
        return () => {
            socketInstance.disconnect();
        };
    }, []);
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
