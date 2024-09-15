import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SignedURLType } from "../validation/s3.validation";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
    }
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;

export async function createPreSignedPostURL({ key, contentType, chatId }: SignedURLType) {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `${chatId}/${key}/${Date.now()}`,
            ContentType: contentType,
            ContentLength: 5 * 1024 * 1024
        })

        const fileLink = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
        const signedURL = await getSignedUrl(s3Client, command, { expiresIn: 300 * 24 * 60 * 60 });
        return { signedURL, fileLink };

    } catch (error) {
        console.log(error, "Error in creating presigned URL")

        return { signedURL: "", fileLink: "" }
    }


}