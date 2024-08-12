import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { User } from "./CreateChat";
import { Input } from "../ui/input";

type CreateGroupChatProps = {
  openGroupChatModal: boolean;
  setOpenGroupChatModal: React.Dispatch<React.SetStateAction<boolean>>;
  users: User[];
  selectUser: string[];
  createChat: (isGroupChat: boolean, members: string | string[], groupName:string|null) => Promise<void>;
};

function CreateGroupChat({
  openGroupChatModal,
  setOpenGroupChatModal,
  users,
  selectUser,
  createChat
}: CreateGroupChatProps) {
const [groupName, setGroupName]=useState("")
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
            <Input value={groupName} onChange={e=>setGroupName(e.target.value)} placeholder="Enter group name" />
              {selectedUsers.map((user) => (
                <div key={user.id}>
                  <p>{user.name}</p>
                </div>
              ))}
              <div className="flex justify-center gap-3 items-center">
                <Button disabled={!groupName} onClick={()=>createChat(true, selectUser, groupName)}>
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
