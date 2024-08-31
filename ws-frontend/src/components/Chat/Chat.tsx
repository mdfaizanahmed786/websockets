import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";
import { useWSStore } from "../../store/wsStore";

interface ChatProps{
  id:string;
  chatName:string | null | undefined
  createdAt:string
  unReadMessage:{
    chatId:string
    messages:string[]
  }

}
function Chats({
  id,
  createdAt,
chatName,

}: ChatProps) {
  const navigate = useNavigate();

  const socket=useWSStore((state)=>state.socket)

const {unReadMessage,setUnReadMessage}=useChatStore((state)=>({
  unReadMessage:state.unReadMessage,
  setUnReadMessage:state.setUnReadMessage
}))

const handleRedirectToChat=()=>{
  navigate(`/chat/${id}`)
  if(socket){
    socket.send(JSON.stringify({
      type:"clear_unread_message",
      data:{
        chatId:id
      }
    }))
  }
  setUnReadMessage({
    chatId:'',
    messages:[]
  })

}

console.log(unReadMessage)

const checkUnreadMessage=id==unReadMessage.chatId && unReadMessage.messages.length!==0

  return (
    <div onClick={handleRedirectToChat} className="cursor-pointer hover:bg-slate-100 hover:rounded-md transition-bg">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="flex items-center gap-2">
            <h1 className={`${checkUnreadMessage &&'font-bold' } text-sm`}>{chatName}</h1>
            {checkUnreadMessage  && <span className="bg-black text-white flex items-center justify-center flex-grow-0 h-4 w-4 rounded-full">{unReadMessage.messages.length}</span>}
            </div>
            <p className="text-sm text-gray-500">Last message</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleTimeString()}</p>
        </div>
      </div>

    </div>
  )
}

export default Chats