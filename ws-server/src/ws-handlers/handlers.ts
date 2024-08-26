import { formatMessage, handleSend } from "../utils/handlers/sendMessage";
import prisma from "../utils/prisma";
import wss from "../index"
import WebSocket from "ws";

const clients = new Map();
type Chat = {
    id: string;
    members: {
        id: string;
        name: string;
        username: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export async function handleMessage(ws: WebSocket, message: any) {
    const type = message.type
    switch (type) {
        case "online_status":
            await handleOnlineStatus(ws, message)
            break;
        case "join":
            handleChatJoin(ws, message)
            break;
        case "message":
            handleSendMessage(ws, message)
            break;
        case "typing":
            handleTyping(ws, message)
            break;
        case "stop_typing":
            handleStopTyping(ws, message)
            break;
        default:
            console.warn("Unsupported event")
            break;
    }
}


async function handleOnlineStatus(ws: WebSocket, message: any) {
    clients.set(ws, { chatId: null, userId: message.data.userId })
    console.log(`Client with userId: ${message.data.userId} is online`)
    const chatsAssociatedWithUser = await prisma.chat.findMany({
        where: {
            members: {
                some: {
                    id: message.data.userId
                }
            },

        },
        select: {
            id: true,
            members: true
        }
    })
    const onlineUsersInChat = filterOutOnlineUsers(chatsAssociatedWithUser)

    broadCastToAllClients({
        type: "online_status",
        data: onlineUsersInChat
    })
}

function handleChatJoin(ws: WebSocket, message: any) {
    const { userId, chatId } = message.data
    const clientInfo = clients.get(ws)
    clients.set(ws, { ...clientInfo, chatId, userId });
    console.log(`Client joined chat: ${message.data.chatId}`);
}

function handleSendMessage(ws: WebSocket, message: any) {
    console.log("Message received..")
    const messagePayload = formatMessage(message.data)
    handleSend(wss, clients, messagePayload)
}

function handleTyping(ws: WebSocket, message: any) {
    const typingPayload = message.data;
    broadCastToChatClients(ws, {
        type: "typing",
        data: {
            name: typingPayload.name,
            chatId: typingPayload.chatId
        }
    })

}

function handleStopTyping(ws: WebSocket, message: any) {
    const typingPayload = message.data;
    broadCastToAllClients({
        type: "stop_typing",
        data: {
            name: typingPayload.name,
            chatId: typingPayload.chatId
        }
    })
}

function filterOutOnlineUsers(chatsAssociatedWithUser: Chat[]) {
    const onlineUsers = Array.from(clients.values()).map((client) => client.userId)
    const filterOnlineUsers = chatsAssociatedWithUser.map((chat) => chat.members.map((member) => member.id)).flat()
    return onlineUsers.filter((user) => filterOnlineUsers.includes(user))
}


function broadCastToAllClients(data: any) {
    wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: data.type,
                data: data.data
            }))
        }
    }
    )
}



function broadCastToChatClients(ws: WebSocket, data: any) {
    wss.clients.forEach((client: WebSocket) => {
        if (client !== ws && client.readyState === WebSocket.OPEN && clients.get(client).chatId === data.data.chatId) {
            client.send(JSON.stringify({
                type: data.type,
                data: data.data
            }))
        }
    })
}


export function handleDisconnect(ws: WebSocket) {
    clients.delete(ws)
    broadCastToAllClients({
        type: 'online_status',
        data: Array.from(clients.values()).map((client) => client.userId)
    })
    console.log(`Client left`)
}

