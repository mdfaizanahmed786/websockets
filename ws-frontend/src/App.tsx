import {
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ChatContainer from "./components/Chat/ChatContainer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import { useUserStore } from "./store/userStore";
function App() {
  const navigate = useNavigate();
  const { setUserId, setUserName, setName } = useUserStore((state) => ({
    setUserId: state.setUserId,
    setUserName: state.setUserName,
    setName:state.setName
  }));

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/user/me",
          {
            withCredentials: true,
          }
        );

        if (!response.data.success) {
          toast.error(response.data.message);

          navigate("/login");
        }
        setUserId(response.data.user.id);
        setUserName(response.data.user.username);
        setName(response.data.user.name);
        
      } catch (error) {
        toast.error(error.response.data.message);
        navigate("/login");
      }
    };
    getUserInfo();
  }, []);
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat/:chatId" element={<ChatContainer />} />
        <Route path="/" element={<ChatContainer />} />
      </Routes>
    </>
  );
}

export default App;
