import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { createChatValidation } from "../validation/chat.validation";


export async function createChat(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const validateChatCreation = createChatValidation.safeParse(req.body);

    console.log(validateChatCreation, "Lets see this ")

    if (!validateChatCreation.success) {
        return res.status(400).json({ message: validateChatCreation.error.errors, success: false });
    }

    const { name, users, isGroupChat } = validateChatCreation.data;

    if (isGroupChat && !name) {
        return res.status(400).json({ message: "Name is required for group chat", success: false });
    }

    if (isGroupChat && users.length < 2) {
        return res.status(400).json({ message: "Group chat must have at least 2 users", success: false });
    }

    try {
        const chat = await prisma.chat.create({
            data: {
                name,
                isGroupChat,
                members: {
                    connect: [...users.map((userId: string) => ({ id: userId })), { id: user.id }]
                }
            }
        });

        return res.status(201).json({ message: "Chat created", chat, success: true });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", success: false });

    }
}


export async function getAllChats(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;
    console.log(user.id, "User id")
    if (!user) {
        return res.status(401).json({ message: "Unauthorized", success: false });
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
                id: true,
                members: {
                    select: {
                        name: true,
                        username: true,
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }

        })



        return res.status(200).json({ message: "Chats fetched", chats, success: true });


    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });

    }

}

export async function getChatById(req: Request, res: Response) {
    const chatId = req.params.id;
    // @ts-ignore
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }

    try {
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                members: {
                    some: {
                        id: user.id
                    }
                }
            },
            select: {
                name: true,
                isGroupChat: true,
                createdAt: true,

                messages: {
                    select: {
                        id: true,
                        message: true,
                        createdAt: true,
                        sender: true
                    }
                },
                members: {
                    select: {
                        id: true,
                        name: true,
                        username: true

                    }

                }
            }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found", success: false });
        }
        return res.status(200).json({ message: "Chat fetched", chat, success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }


}
