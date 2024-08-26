import WebSocket from "ws";
export type Chat = {
    id: string;
    members: {
        id: string;
        name: string;
        username: string;
    }[];
}

export enum Events {
    ONLINE = "online_status",
    JOIN = "join",
    MESSAGE = "message",
    TYPING = "typing",
    STOP_TYPING = "stop_typing"
}

type Payload = {
    chatId: string
    userId: string
    name: string
}


type Message = {
    message: string
    chatId: string
    sender: {
        id: string
        name: string
    }
}

export type TypingPayload = {
    type: Events.TYPING | Events.STOP_TYPING,
    data: Payload
}

export type JoinPayload = {
    type: Events.JOIN,
    data: Omit<Payload, 'name'>
}


export type MessagePayload = {
    type: Events.MESSAGE,
    data: Message
}


export type OnlineStatusPayload = {
    type: Events.ONLINE,
    data: Omit<Payload, 'chatId' | 'name'>
}


export type ClientType=Map<WebSocket, { chatId: null | string, userId: null | string }>


export type DataPayload = TypingPayload | JoinPayload | OnlineStatusPayload | MessagePayload


export type BroadCastData={
    type:string
    data:any
}



