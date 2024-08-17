import { Server, WebSocket } from "ws"
import { v4 as uuidv4, } from "uuid"

type MessagePayload = {

    id: string;
    message: any;
    chatId: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
    };

}

export const formatMessage = (data: any) => {
    console.log(data, "Data")
    const messagePayload = {
        id: uuidv4(),
        message: data.message,
        chatId: data.chatId,
        createdAt: new Date().toISOString(),
        sender: {
            id: data.sender.id,
            name: data.sender.name,
        }
    }
    return messagePayload as MessagePayload
}


export const handleSend = (wss: any, clients: Map<any, any>, messagePayload: MessagePayload) => {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN && clients.get(client) === messagePayload.chatId) {
            client.send(JSON.stringify({
                type: "message",

                data: messagePayload

            }))
        }
    })


}