import z from 'zod';

export const signupUserValidation=z.object({
    name: z.string().min(3).max(255).trim(),
    username: z.string().min(3).max(255).trim(),
    password: z.string().min(8).trim()

})

export const loginUserValidation=z.object({
    username: z.string().min(3).max(255).trim(),
    password: z.string().min(8).trim()
})


