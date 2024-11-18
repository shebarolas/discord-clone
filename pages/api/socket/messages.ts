import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types/type/socketType";
import { error } from "console";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if(req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    try {
        const profile = await currentProfilePages(req);
        if(!profile) return res.status(401).json({error: "Unauthorized"});

        const {content, channelId, serverId} = await req.body;
        if(!serverId) return res.status(400).json({error: "Server ID is required"});
        if(!channelId) return res.status(400).json({error: "Channel ID is required"});
        return res.status(200).json({content})



    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }

}