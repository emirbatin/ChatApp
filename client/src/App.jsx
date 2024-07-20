import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import ChatPage from "./pages/ChatPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path= "/chat" element={<ChatPage/>}></Route>
      </Routes>
    </div>
  )
}

export default App
