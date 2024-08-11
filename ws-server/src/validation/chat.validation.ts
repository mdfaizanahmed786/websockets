import z from "zod"

export const chatMessageValidation=z.object({
    message: z.string().min(1).max(255).trim(),
    chatId: z.string().min(1).max(255).trim()
})


export const createChatValidation=z.object({
    name: z.string().min(3).max(255).trim().optional(),
    users: z.array(z.string()).min(1),
    isGroupChat: z.boolean()
})
