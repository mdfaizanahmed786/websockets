import { WebSocket } from "ws"
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
    media?: string
    messageType?: string

}

export const formatMessage = (data: any) => {
    const messagePayload = {
        id: uuidv4(),
        message: data.message,
        chatId: data.chatId,
        media: data.media,
        messageType: data.messageType,

        createdAt: new Date().toISOString(),
        sender: {
            id: data.sender.id,
            name: data.sender.name,
        }
    }
    return messagePayload as MessagePayload
}


export const handleSend = (wss: any, clients: Map<any, any>, messagePayload: MessagePayload) => {
    console.log(messagePayload, "Message   payload")
    wss.clients.forEach((client: WebSocket) => {
        console.log(clients.get(client).chatId, messagePayload.chatId, "Chat id")
        if (client.readyState === WebSocket.OPEN && clients.get(client).chatId === messagePayload.chatId) {

            client.send(JSON.stringify({
                type: "message",
                data: messagePayload

            }))
        }
    })


}