import axios from "axios";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import toast from "react-hot-toast";
import { useCallback, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useNavigate } from "react-router-dom";
import CreateGroupChat from "./CreateGroupChat";
export type User = {
  id: string;
  name: string;
  username: string;
};
function CreateChat() {
  const [users, setUsers] = useState([]);
  const [openGroupChatModal, setOpenGroupChatModal] = useState(false);  
  const [selectUser, setSelectUsers] = useState<string[]>([]);
  const navigate=useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/v1/user/all",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleAddUsers = (id: string) => {
    setSelectUsers((prev) => {
      if (prev?.includes(id)) {
        return prev?.filter((userId) => userId !== id);
      }
      return [...prev, id];
    });
  };


  const createChat=useCallback(async (isGroupChat:boolean, members:string|string[], groupName:string | null)=>{
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/chat/create",
        {
          isGroupChat,
          users:[members],
          name:groupName
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/chat/${response.data.chat.id}`);

      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }

  },[])

  

  return (
    <Dialog>
      <DialogTrigger>
        <Button onClick={fetchUsers} className="w-full">
          Create Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a user to chat with!</DialogTitle>
          <DialogDescription>
            {users.map((user: User) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 border-b"
              >
                <Checkbox
                  checked={selectUser?.includes(user.id)}
                  onCheckedChange={() => handleAddUsers(user.id)}
                />

                <p>{user.name}</p>
                <Button onClick={()=>createChat(false, user.id, null)} disabled={selectUser.length>=2}>Chat</Button>
              </div>
            ))}
            <div className="flex justify-center mt-5">
              {selectUser.length >= 2 && <Button onClick={()=>setOpenGroupChatModal(true)}>Create Group Chat</Button>}
            </div>
            <CreateGroupChat createChat={createChat} users={users} selectUser={selectUser} openGroupChatModal={openGroupChatModal}  setOpenGroupChatModal={setOpenGroupChatModal} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChat;
