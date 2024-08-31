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
    STOP_TYPING = "stop_typing",
    UNREAD_MESSAGE="unread_message",
    CLEAR_UNREAD_MESSAGE="clear_unread_message"
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


export type UnreadMessagePayload={
    type:Events.UNREAD_MESSAGE
    data:{
       message:string,
       chatId:string
       userId:string
    }
}

export type ClearUnreadMessagePayload={
    type:Events.CLEAR_UNREAD_MESSAGE
    data:{
        chatId:string
    }
}


export type OnlineStatusPayload = {
    type: Events.ONLINE,
    data: Omit<Payload, 'chatId' | 'name'>
}


export type ClientType=Map<WebSocket, { chatId: null | string, userId: null | string }>

export type RecentMessages=Map<string,string[]>

export type DataPayload = TypingPayload | JoinPayload | OnlineStatusPayload | MessagePayload | UnreadMessagePayload | ClearUnreadMessagePayload


export type BroadCastData={
    type:string
    data:any
}



