import { formatMessage, handleSend } from "../utils/handlers/sendMessage";
import prisma from "../utils/prisma";
import wss from "../index"
import WebSocket from "ws";
import { BroadCastData, Chat, ClearUnreadMessagePayload, ClientType, DataPayload, Events, JoinPayload, MessagePayload, OnlineStatusPayload, RecentMessages, TypingPayload, UnreadMessagePayload } from "../types/typings";

const clients: ClientType = new Map();
const recentMessages: RecentMessages= new Map();

export async function handleMessage(ws: WebSocket, message: DataPayload) {
    const type = message.type
    console.log(type, "THIS IS MESAG TYPE")
    switch (type) {
        case Events.ONLINE:
            await handleOnlineStatus(ws, message)
            break;
        case Events.JOIN:
            handleChatJoin(ws, message)
            break;
        case Events.MESSAGE:
            handleSendMessage(ws, message)
            break;
        case Events.TYPING:
            handleTyping(ws, message)
            break;
        case Events.STOP_TYPING:
            handleStopTyping(ws, message)
            break;
        case Events.UNREAD_MESSAGE:
            handleSendResendMessage(ws, message)
            break;
        case Events.CLEAR_UNREAD_MESSAGE:
            handleClearUnreadMessage(ws, message)
            break;
        default:
            console.warn("Unsupported event")
            break;
    }
}


async function chatsWithAuthorizedUser(userId:string){
    const chats = await prisma.chat.findMany({
        where: {
            members: {
                some: {
                    id: userId
                }
            },
        },
        select: {
            id: true,
            members: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        }
    })

    return chats
}


async function handleOnlineStatus(ws: WebSocket, message: OnlineStatusPayload) {
    clients.set(ws, { chatId: null, userId: message.data.userId })
    console.log(`Client with userId: ${message.data.userId} is online`)
    const userId=message.data.userId
    const chatsAssociatedWithUser = await chatsWithAuthorizedUser(userId)
    const onlineUsersInChat = filterOutOnlineUsers(chatsAssociatedWithUser)

    broadCastToAllClients({
        type: "online_status",
        data: onlineUsersInChat
    })
}

function handleChatJoin(ws: WebSocket, message: JoinPayload) {
    const { userId, chatId } = message.data
    const clientInfo = clients.get(ws)
    clients.set(ws, { ...clientInfo, chatId, userId });
    console.log(`Client joined chat: ${message.data.chatId}`);

}

function handleSendMessage(ws: WebSocket, message: MessagePayload) {
    console.log("Message received..")
    const messagePayload = formatMessage(message.data)
    handleSend(wss, clients, messagePayload)
}

function handleTyping(ws: WebSocket, message: TypingPayload) {
    const typingPayload = message.data;
    broadCastToChatClients(ws, {
        type: "typing",
        data: {
            name: typingPayload.name,
            chatId: typingPayload.chatId
        }
    })

}

function handleStopTyping(ws: WebSocket, message: TypingPayload) {
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
    return onlineUsers.filter((user) => filterOnlineUsers.includes(user!))
}


async function handleSendResendMessage(ws:WebSocket, message:UnreadMessagePayload){
    if(!recentMessages.has(message.data.chatId)){
        recentMessages.set(message.data.chatId,[])
    }

    const chats=await chatsWithAuthorizedUser(message.data.userId)
    const chat=chats.find((chat)=>chat.id===message.data.chatId)
    if(!chat){
        return
    }
    const messages=recentMessages.get(chat.id) || []
    messages.push(message.data.message)
    broadCastExceptSender(ws,{
        type:"unread_message",  
        data:{
            chatId:message.data.chatId,
            messages
        }
    })
}

function handleClearUnreadMessage(ws:WebSocket, message:ClearUnreadMessagePayload){
    if(recentMessages.has(message.data.chatId)){
        const messages=recentMessages.get(message.data.chatId)
        console.log(messages, "These are messages....")
        if(messages){
            recentMessages.set(message.data.chatId,[])
        }
    }
    broadCastToChatClients(ws,{
        type:"clear_unread_message",
        data:{
            chatId:message.data.chatId
        }
    })
    console.log("Clearing unread message")
}

function broadCastExceptSender(ws: WebSocket, data: BroadCastData) {    
    wss.clients.forEach((client: WebSocket) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: data.type,
                data: data.data
            }))
        }
    })
}


function broadCastToAllClients(data: BroadCastData) {
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


function broadCastToChatClients(ws: WebSocket, data: BroadCastData) {
    wss.clients.forEach((client: WebSocket) => {
        if (client !== ws && client.readyState === WebSocket.OPEN && clients.get(client)?.chatId === data.data.chatId) {
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

