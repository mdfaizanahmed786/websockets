import {create} from "zustand"

type UserState={
    userId: string
    userName: string
    name:string
}


type UserAction={
    setUserId: (userId: UserState['userId']) => void
    setUserName: (userName: UserState['userName']) => void
    setName:(name:UserState['name'])=>void
}


const initialUserState = {
    userId: '',
    userName: '',
    name:''
}


export const useUserStore = create<UserState & UserAction>((set) => ({
    ...initialUserState,
    setUserId: (userId: string) => set(() => ({ userId })),
    setUserName: (userName: string) => set(() => ({ userName })),
    setName:(name:string)=>set(()=>({name}))    
}))
