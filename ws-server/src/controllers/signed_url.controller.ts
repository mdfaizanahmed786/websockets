import { Request, Response } from "express";
import signedURLValidation from "../validation/s3.validation";
import { createPreSignedPostURL } from "../utils/s3";

export async function signedURL(req: Request, res: Response) {

    try {
        const fileDetails = req.body;
        const parseData = signedURLValidation.safeParse(fileDetails);
        if (!parseData.success) {
            return res.status(400).json({ message: parseData.error.errors, success: false })
        }

        const { key, contentType, chatId } = parseData.data;

        const { signedURL, fileLink } = await createPreSignedPostURL({ key, contentType, chatId });

        if (signedURL && fileLink) {
            return res.status(200).json({ signedURL, fileLink, success: true })
        }

        return res.status(400).json({ message: "Error in creating presigned URL", success: false })

    } catch (error) {

        return res.status(500).json({ message: "Internal server error", success: false })
    }
}
