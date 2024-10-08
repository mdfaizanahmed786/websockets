import { Request, Response } from "express";
import { loginUserValidation, signupUserValidation } from "../validation/user.validation";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export async function signUp(req: Request, res: Response) {
    const validateFields = signupUserValidation.safeParse(req.body);

    if (!validateFields.success) {
        return res.status(400).json({ message: validateFields.error.errors, success:false });
    }

    try {
        const { name, username, password } = validateFields.data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!);
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
          });

        return res.status(201).json({ message: "Signup success!", token, user_id: newUser.id, success:true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error",success:false });
    }
}
export async function login(req: Request, res: Response) {
    const validateFields = loginUserValidation.safeParse(req.body);

    if (!validateFields.success) {
        return res.status(400).json({ message: validateFields.error.errors, success:false });
    }

    try {
        const { username, password } = validateFields.data;

        const user = await prisma.user.findFirst({
            where: {
                username
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success:false });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid credentials!", success:false })
        }


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
          });

        return res.status(200).json({ message: "Login success!", token, user_id: user.id, success:true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success:false });

    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                // @ts-ignore
                id: req.user.id
            },
            select: {
                id: true,
                name: true,
                username: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success:false });
        }

        return res.status(200).json({ user, success:true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success:false });

    }
}

export async function getAllUsers(req:Request, res:Response){
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true
            }
        });

        return res.status(200).json({ users, success:true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success:false });

    }
}


export async function logout(req:Request, res:Response){
    res.clearCookie('token');
    return res.status(200).json({ message: "Logged out", success:true });
}


