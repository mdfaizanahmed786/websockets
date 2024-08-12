import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ChatContainer from "./components/Chat/ChatContainer";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat/:chatId" element={<ChatContainer />} />
        <Route path="/" element={<ChatContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
