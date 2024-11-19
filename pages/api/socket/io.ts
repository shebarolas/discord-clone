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
    try {
        if (!res.socket.server.io) {
            const httpServer: NetServer = res.socket.server as any;
            const io = new ServerIO(httpServer, {
                path: "/api/socket/io",
                addTrailingSlash: false,
            })

            res.socket.server.io = io;
        }
        res.end();
    } catch (error) {
        console.log(error);
    }


}

export default ioHandler;