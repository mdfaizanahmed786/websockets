import { Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ChatContainer from "./components/Chat/ChatContainer";

function App() {
  return (
    <div className="overflow-hidden">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ChatContainer />} />
        <Route path="/:chatId" element={<ChatContainer />} />
      </Routes>
    </div>
  );
}

export default App;
