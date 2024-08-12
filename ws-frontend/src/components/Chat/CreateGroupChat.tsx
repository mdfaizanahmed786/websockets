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
};

function CreateGroupChat({
  openGroupChatModal,
  setOpenGroupChatModal,
  users,
  selectUser,
}: CreateGroupChatProps) {
  const selectedUsers = users.filter((user) => selectUser.includes(user.id));
  return (
    <Dialog open={openGroupChatModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-4">
              {selectedUsers.map((user) => (
                <div key={user.id}>
                  <p>{user.name}</p>
                </div>
              ))}

              <Button onClick={() => setOpenGroupChatModal(false)}>
                Cancel
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CreateGroupChat;
