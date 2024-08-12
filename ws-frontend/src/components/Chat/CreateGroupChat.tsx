import { useMemo } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { User } from "./CreateChat";

type CreateGroupChatProps = {
  openGroupChatModal: boolean;
  setOpenGroupChatModal: React.Dispatch<React.SetStateAction<boolean>>;
  users: User[];
  selectUser: string[];
  createChat: (isGroupChat: boolean, members: string | string[]) => Promise<void>;
};

function CreateGroupChat({
  openGroupChatModal,
  setOpenGroupChatModal,
  users,
  selectUser,
  createChat
}: CreateGroupChatProps) {
  const selectedUsers = useMemo(
    () => users.filter((user) => selectUser.includes(user.id)),
    [users.length, selectUser.length]
  );
  return (
    <Dialog open={openGroupChatModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selected Users</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2 mt-4">
              {selectedUsers.map((user) => (
                <div key={user.id}>
                  <p>{user.name}</p>
                </div>
              ))}
              <div className="flex justify-center gap-3 items-center">
                <Button onClick={()=>createChat(true, selectUser)}>
                  Confirm
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setOpenGroupChatModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGroupChat;
