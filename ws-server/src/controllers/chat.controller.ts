import { Request, Response } from "express";
import prisma from "../utils/prisma";


export async function createChat(req: Request, res: Response) {

}


export async function getAllChats(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const chats = await prisma.chat.findMany({
            where: {
                members: {
                    some: {
                        id: user.id
                    },

                },

            },

            select: {
                name: true,
                isGroupChat: true,
                createdAt: true,
                members: false
            }

        });

        return res.status(200).json(chats);
        

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", });

    }

}

export async function getChatById(req: Request, res: Response) {

}
