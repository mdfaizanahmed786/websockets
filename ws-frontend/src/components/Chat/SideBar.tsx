import axios from "axios";
import { Button } from "../ui/button";
import {useEffect} from 'react'
import Chat from "./Chat";
import CreateChat from "./CreateChat";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/v1/user/logout",

        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(()=>{
      const fetchChats=async()=>{
        try {
          const response = await axios.get(
            "http://localhost:5001/api/v1/chat",
            {
              withCredentials: true,
            }
          );
    
          if (response.data.success) {
            console.log(response.data.chats);
          }
          
        } catch (error) {
            console.log(error)
          
        }
      }

      fetchChats()
  },[])
  return (
    <div className="relative border-r-2 h-full border-gray-200 p-5">
      <div className="flex flex-col space-y-3 h-full">
        <div className="flex flex-col gap-2">
          <CreateChat />
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <Chat />
          {/* Repeat <Chats /> as needed */}
        </div>

        <div className="bg-white">
          <Button onClick={logout} className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
