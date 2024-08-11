import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken"

async function verifyToken(token: string) {
  try {

    const decodedToken=jwt.verify(token,process.env.JWT_SECRET!);
    console.log(decodedToken)
    return decodedToken
    
  } catch (error) {
     throw Error("Invalid token")

  }
}

export async function authMiddleware(req:Request, res:Response, next:NextFunction) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await verifyToken(token);
    // @ts-ignore
    req.user = user;
    next();
    }
    catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
}