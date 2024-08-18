import { create } from "zustand";

type ChatState={
    chatId: string
    chatName: string,
    isGroupChat:boolean
}

type ChatAction={
    setChatId: (chatId: ChatState['chatId']) => void
    setChatName: (chatName: ChatState['chatName']) => void
    setGroupChat: (isGroupChat:ChatState['isGroupChat']) =>void
}

const initialChatState = {
    chatId: '',
    chatName: '',
    isGroupChat:false,
}


export const useChatStore = create<ChatState & ChatAction>((set) => ({
    ...initialChatState,
    setChatId: (chatId: string) => set(() => ({ chatId })),
   setChatName: (chatName: string) => set(() => ({ chatName })),
   setGroupChat:(isGroupChat:boolean)=>set(()=> ({isGroupChat}))

}))





