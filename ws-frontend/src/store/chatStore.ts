import { create } from "zustand";

type Members={
    id:string
    name:string
    username:string
   
}

type ChatState = {
    chatId: string
    chatName: string,
    isGroupChat: boolean
    members: Members[]
    unReadMessage:{
        chatId:string
        messages:string[]
    }
}

type ChatAction = {
    setChatId: (chatId: ChatState['chatId']) => void
    setChatName: (chatName: ChatState['chatName']) => void
    setGroupChat: (isGroupChat: ChatState['isGroupChat']) => void
    setMembers: (members: ChatState['members']) => void
    setUnReadMessage:(unReadMessage:ChatState['unReadMessage'])=>void
    
}


const initialChatState = {
    chatId: '',
    chatName: '',
    members: [],
    isGroupChat: false,
    unReadMessage:{
        chatId:'',
        messages:[]
    }
}


export const useChatStore = create<ChatState & ChatAction>((set) => ({
    ...initialChatState,
    setChatId: (chatId: string) => set(() => ({ chatId })),
    setMembers: (members: Members[]) => set(() => ({ members })),
    setChatName: (chatName: string) => set(() => ({ chatName })),
    setGroupChat: (isGroupChat: boolean) => set(() => ({ isGroupChat })),
    setUnReadMessage:(unReadMessage:ChatState['unReadMessage'])=>set(()=>({unReadMessage}))
    

}))





