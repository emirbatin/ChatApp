import { Input, Checkbox, Link, Spacer, Button } from "@nextui-org/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AlertPopup from "../components/AlertPopup";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  
  const navigate = useNavigate();

  const userEmailInput = "test@test.com"
  const userPasswordInput = "test123"

  const handleLogin = () => {
    setLoading(true);
    if (!email || !password) {
      setPopupMessage("All fields are required");
      setShowPopup(true);
      setLoading(false);
      return;
    }
    
    if(email === userEmailInput && password === userPasswordInput) {
      console.log("Login Successful");
      navigate("/chat");
    } else {
      setPopupMessage("Invalid email or password");
      setShowPopup(true);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full justify-center text-start md:w-[30vw] sm:w-[60vw]">
      <h1>Login</h1>
      <Spacer y={4} />
      <Input
        autoFocus
        endContent={
          <EnvelopeIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Email"
        placeholder="Enter your email"
        isRequired
        type="email"
        variant="bordered"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setShowPopup(false)}
      />
      <Spacer y={2} />
      <Input
        endContent={
          <LockClosedIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        isRequired
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setShowPopup(false)}
      />
      <Spacer y={4} />
      <div className="flex py-2 px-1 justify-between">
        <Checkbox
          classNames={{
            label: "text-small",
          }}
        >
          Remember me
        </Checkbox>
        <Link color="primary" href="#" size="sm">
          Forgot password?
        </Link>
      </div>
      <Spacer y={4} />
      <div className="flex flex-col">
        <Button color="primary" onClick={handleLogin} loading={loading}>
          Login
        </Button>
        <Spacer y={2} />
        <Link color="primary" href="register" size="sm">
          Create Account
        </Link>
      </div>
      {showPopup && (
        <AlertPopup
        show={showPopup}
        message={popupMessage}
        onClose={() => setShowPopup(false)}
      />
      )}
    </div>
  );
};

export default LoginPage;
