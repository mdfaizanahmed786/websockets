import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { WebSocketServer } from "ws"
require("dotenv").config()
const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.use("/api/v1/chat", require("./routes/chat.route"))
app.use("/api/v1/user", require("./routes/user.route"))
app.use("/api/v1/message", require("./routes/message.route"))


const server = app.listen(5001)


const wss = new WebSocketServer({ server })




