import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { WebSocketServer } from "ws"
require("dotenv").config()
import chatRouter from "./routes/chat.route"
import userRouter from "./routes/user.route"
import messageRouter from "./routes/message.route"

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/message", messageRouter)


const server = app.listen(5001, ()=>{
    console.log("Server is running on port 5001")
})


const wss = new WebSocketServer({ server })




