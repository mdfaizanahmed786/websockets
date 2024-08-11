import { Request, Response } from "express";
import { chatMessageValidation } from "../validation/chat.validation";
import prisma from "../utils/prisma";


export async function sendMessage(req: Request, res: Response) {
    const validateMessage = chatMessageValidation.safeParse(req.body);
    if (!validateMessage.success) {
        return res.status(400).json({ message: validateMessage.error.errors })
    }

    const chatId = validateMessage.data.chatId

    const existingChatId = await prisma.chat.findFirst({
        where: {
            id: chatId
        }
    })

    if (!existingChatId) {
        return res.status(404).json({ message: "Chat not found" })
    }
    try {
        const { message } = validateMessage.data;
        // @ts-ignore
        const user = req.user;
        const newMessage = await prisma.message.create({
            data: {
                message,
                chatId,
                senderId: user.id
            }
        });

        return res.status(201).json({ message: "Message sent!", newMessage });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", });
    }
}