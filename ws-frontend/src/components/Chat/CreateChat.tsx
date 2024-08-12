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
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
type User = {
  id: string;
  name: string;
  username: string;
};
function CreateChat() {
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUsers] = useState<string[]>([]);

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
                <Button>Chat</Button>
              </div>
            ))}
            <div className="flex justify-center mt-5">
              {selectUser.length >= 2 && <Button>Create Group Chat</Button>}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChat;
