import { create } from "zustand";

type ChatState={
    chatId: string
    chatName: string
}

type ChatAction={
    setChatId: (chatId: ChatState['chatId']) => void
    setChatName: (chatName: ChatState['chatName']) => void
}

const initialChatState = {
    chatId: '',
    chatName: ''
}


export const useChatStore = create<ChatState & ChatAction>((set) => ({
    ...initialChatState,
    setChatId: (chatId: string) => set(() => ({ chatId })),
   setChatName: (chatName: string) => set(() => ({ chatName }))


}))





