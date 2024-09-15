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
import { useCallback, useMemo, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useNavigate } from "react-router-dom";
import CreateGroupChat from "./CreateGroupChat";
import { useUserStore } from "../../store/userStore";
export type User = {
  id: string;
  name: string;
  username: string;
};
type CreateChatProps = {
  handleCloseNav: () => void;
};
function CreateChat({ handleCloseNav }: CreateChatProps) {
  const [users, setUsers] = useState([]);
  const [openGroupChatModal, setOpenGroupChatModal] = useState(false);
  const [selectUser, setSelectUsers] = useState<string[]>([]);
  const userId = useUserStore((state) => state.userId);
  const navigate = useNavigate();
  const [singleChat, setSingleChatModal] = useState(false);

  const fetchUsers = async () => {
    setSingleChatModal(true);
    try {
      const response = await axios.get(
        "https://api.anxiousdev.online/api/v1/user/all",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
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

  const createChat = useCallback(
    async (
      isGroupChat: boolean,
      members: string | string[],
      groupName: string | null
    ) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/create`,
          {
            isGroupChat,
            users: !isGroupChat ? [members] : members,
            name: groupName,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          navigate(`/chat/${response.data.chat.id}`);
          setOpenGroupChatModal(false);
          setSingleChatModal(false);
          setSelectUsers([]);
          handleCloseNav();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        // toast.error(error.response.data.message);
      }
    },
    []
  );

  const filterUsers = useMemo(
    () => users.filter((user: User) => user.id !== userId),
    [users.length, userId]
  );

  return (
    <Dialog open={singleChat} onOpenChange={setSingleChatModal}>
      <DialogTrigger>
        <Button onClick={fetchUsers} className="w-full">
          Create Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a user to chat with!</DialogTitle>
          <DialogDescription>
            {filterUsers.map((user: User) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 border-b"
              >
                <Checkbox
                  checked={selectUser?.includes(user.id)}
                  onCheckedChange={() => handleAddUsers(user.id)}
                />

                <p>{user.name}</p>
                <Button
                  onClick={() => createChat(false, user.id, null)}
                  disabled={selectUser.length >= 2}
                >
                  Chat
                </Button>
              </div>
            ))}
            <div className="flex justify-center mt-5">
              {selectUser.length >= 2 && (
                <Button onClick={() => setOpenGroupChatModal(true)}>
                  Create Group Chat
                </Button>
              )}
            </div>
            <CreateGroupChat
              createChat={createChat}
              users={filterUsers}
              selectUser={selectUser}
              openGroupChatModal={openGroupChatModal}
              setOpenGroupChatModal={setOpenGroupChatModal}
            />
          </DialogDescription>
        </DialogHeader>
        {!(selectUser.length >= 2) && (
          <div className="mt-1 text-center">
            <Button
              onClick={() => setSingleChatModal(false)}
              variant="destructive"
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateChat;
