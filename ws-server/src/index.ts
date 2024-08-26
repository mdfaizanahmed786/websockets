import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import { WebSocketServer } from "ws"
import chatRouter from "./routes/chat.route"
import messageRouter from "./routes/message.route"
import userRouter from "./routes/user.route"
import { handleDisconnect, handleMessage } from "./ws-handlers/handlers"
require("dotenv").config()



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


const server = app.listen(5001, () => {
    console.log("Server is running on port 5001")
})

const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
    console.log("connection done successfully..")
    ws.on("message", async (data) => {
        const message = JSON.parse(data.toString());
        try {
         handleMessage(ws, message)

        } catch (error) {
        console.log(error)

        }
    })

    ws.on("close", () => {
        handleDisconnect(ws)
    })

    ws.on("error", () => {
        console.log("Got some error")
    })
})

export default wss

