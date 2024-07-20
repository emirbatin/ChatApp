import React, { useState } from "react";
import { Input, Link, Spacer, Button } from "@nextui-org/react";
import AlertPopup from "../components/AlertPopup";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    setLoading(true);
    if (!username || !email || !password) {
      setPopupMessage("All fields are required");
      setShowPopup(true);
      setLoading(false);
      return;
    } else if (password.length < 6) {
      setPopupMessage("Password must be at least 6 characters");
      setShowPopup(true);
      setLoading(false);
      return;
    } else {
      console.log("Registration Successful");
      navigate("/chat");
    }
    console.log("register", { username, email, password });
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full justify-center text-start md:w-[30vw] sm:w-[60vw]">
      <h1>Register</h1>
      <Spacer y={4} />
      <Input
        autoFocus
        label="Username"
        placeholder="Enter your username"
        isRequired
        type="username"
        variant="bordered"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Spacer y={2} />
      <Input
        autoFocus
        label="Email"
        placeholder="Enter your email"
        isRequired
        type="email"
        variant="bordered"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Spacer y={2} />
      <Input
        isRequired
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Spacer y={4} />
      <div className="flex flex-col">
        <Button color="primary" onClick={handleRegister}>
          Register
        </Button>
        <Spacer y={2} />
        <Link color="primary" href="login" size="sm">
          Do you already have an account? Log in!
        </Link>
      </div>
      <AlertPopup
        show={showPopup}
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default RegisterPage;
