import { Input, Checkbox, Link, Spacer, Button } from "@nextui-org/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import AlertPopup from "../components/AlertPopup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();
  const apiUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_URL_DEV
      : import.meta.env.VITE_API_URL_PROD;

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      setPopupMessage("All fields are required");
      setShowPopup(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, {
        email,
        password,
      });

      const { token } = response.data;
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      navigate("/chat");
    } catch (error) {
      setPopupMessage("Invalid email or password");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
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
            isSelected={rememberMe}
            onChange={setRememberMe}
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
    </div>
  );
};

export default LoginPage;
