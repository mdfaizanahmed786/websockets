import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ChatContainer from "./components/Chat/ChatContainer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import { useUserStore } from "./store/userStore";
function App() {
  const { setUserId, setUserName, setName } = useUserStore((state) => ({
    setUserId: state.setUserId,
    setUserName: state.setUserName,
    setName: state.setName,
  }));

  const protectedRoutes = ["/", "/chat/:chatId"];

  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
          {
            withCredentials: true,
          }
        );

        if (!response.data.success) {
          toast.error(response.data.message);

          if (protectedRoutes.includes(location.pathname)) {
            setUserId("");
            setUserName("");
            setName("");
            navigate("/login");
            return;
          }
        } else {
          setUserId(response.data.user.id);
          setUserName(response.data.user.username);
          setName(response.data.user.name);
        }
      } catch (err) {
        if (protectedRoutes.includes(location.pathname)) {
          toast.error("An error occurred");
          navigate("/login");
        }
      }
    };

    getUserInfo();
  }, [location.pathname, navigate]);

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
