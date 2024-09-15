import { z } from 'zod';

const signedURLValidation=z.object({
    key:z.string(),
    contentType:z.string(),
    chatId:z.string().uuid()
})

export type SignedURLType=z.infer<typeof signedURLValidation>

export default signedURLValidation;