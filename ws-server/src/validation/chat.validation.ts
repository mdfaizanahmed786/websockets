import z from "zod"

enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    DOCUMENT = 'DOCUMENT',
  }
  

export const chatMessageValidation=z.object({
    message: z.string().min(1).max(255).trim(),
    chatId: z.string().min(1).max(255).trim(),
    messageType: z.nativeEnum(MessageType).optional(),
    media: z.string().trim().optional()
})



export const createChatValidation=z.object({
    name: z.nullable(z.string().min(1).max(255).trim()),
    users: z.array(z.string()).min(1),
    isGroupChat: z.boolean(),
   
})
