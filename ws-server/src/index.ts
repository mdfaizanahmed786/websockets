import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { WebSocketServer } from "ws"
require("dotenv").config()
import chatRouter from "./routes/chat.route"
import userRouter from "./routes/user.route"
import messageRouter from "./routes/message.route"
import cookieParser from "cookie-parser"
import { formatMessage, handleSend } from "./utils/handlers/sendMessage"
import { setErrorMap } from "zod"

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/message", messageRouter)


const clients = new Map();


const server = app.listen(5001, () => {
    console.log("Server is running on port 5001")
})

const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
    console.log("connection done successfully..")


    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        console.log(message, "Message")
        try {

            if (message.type === "message") {
                const messagePayload = formatMessage(message.data)
                clients.set(ws, messagePayload.chatId)
                handleSend(wss, clients, messagePayload)
            }

        } catch (error) {

            console.log(error)

        }


    })

    ws.on("close", () => {
        clients.delete(ws)
    })

    ws.on("error", () => {
        console.log("Got some error")
    })
})




