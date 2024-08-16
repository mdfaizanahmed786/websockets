import { create } from "zustand";

type wsState = {
    socket: WebSocket | null
}

type WsAction = {
    setSocket: (socket: wsState['socket']) => void

}

const intialSocketState: wsState = {
    socket: null,
}


export const useWSStore = create<wsState & WsAction>((set) => ({
    ...intialSocketState,
    setSocket: (socket: WebSocket | null) => set(() => ({ socket })),
}))
