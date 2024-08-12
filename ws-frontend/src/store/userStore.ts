import {create} from "zustand"

type UserState={
    userId: string
    userName: string
}


type UserAction={
    setUserId: (userId: UserState['userId']) => void
    setUserName: (userName: UserState['userName']) => void
}


const initialUserState = {
    userId: '',
    userName: ''
}


export const useUserStore = create<UserState & UserAction>((set) => ({
    ...initialUserState,
    setUserId: (userId: string) => set(() => ({ userId })),
    setUserName: (userName: string) => set(() => ({ userName }))
}))
