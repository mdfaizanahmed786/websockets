import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { WebSocket, WebSocketServer } from "ws"
require("dotenv").config()
import chatRouter from "./routes/chat.route"
import userRouter from "./routes/user.route"
import messageRouter from "./routes/message.route"
import cookieParser from "cookie-parser"
import { formatMessage, handleSend } from "./utils/handlers/sendMessage"



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
    ws.on("message", async (data) => {
        const message = JSON.parse(data.toString());
        try {
            if (message.type === "online_status") {
                clients.set(ws, { chatId: null, userId: message.data.userId })
                console.log(`Client with userId: ${message.data.userId} is online`)
                const onlineUsers = Array.from(clients.values()).map((client) => client.userId)
                wss.clients.forEach((client: WebSocket) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "online_status",
                            data: onlineUsers
                        }))
                    }
                }
                )
            }

            if (message.type === "join") {
                const { userId, chatId } = message.data
                const clientInfo = clients.get(ws)
                clients.set(ws, { ...clientInfo, chatId, userId });
                console.log(`Client joined chat: ${message.data.chatId}`);
            }

            if (message.type === "message") {
                console.log("Message received..")
                const messagePayload = formatMessage(message.data)
                handleSend(wss, clients, messagePayload)
            }

            if (message.type === "typing") {
                const typingPayload = message.data;
                wss.clients.forEach((client: WebSocket) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN && clients.get(client).chatId === typingPayload.chatId) {
                        client.send(JSON.stringify({
                            type: "typing",
                            data: {
                                name: typingPayload.name
                            }
                        }))
                    }
                })
            }

            if (message.type === "stop_typing") {
                const typingPayload = message.data;
                wss.clients.forEach((client: WebSocket) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN && clients.get(client).chatId === typingPayload.chatId) {
                        client.send(JSON.stringify({
                            type: "stop_typing",
                            data: {
                                name: typingPayload.name
                            }
                        }))
                    }
                })
            }
        } catch (error) {

            console.log(error)

        }
    })

    ws.on("close", () => {
        clients.delete(ws)
        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "online_status",
                    data: Array.from(clients.values()).map((client) => client.userId)
                }))
            }
        }
        )
        console.log(`Client left`)

    })

    ws.on("error", () => {
        console.log("Got some error")
    })
})




