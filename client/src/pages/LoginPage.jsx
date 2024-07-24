import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { BASE_URL } from "../main";
import { Input, Spacer, Button, Checkbox } from "@nextui-org/react";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      dispatch(setAuthUser(res.data));
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setUser({
      username: "",
      password: "",
    });
  };

  return (
    <div className="min-w-[32rem] mx-auto">
      <div className="w-full p-0 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10">
        <h1 className="text-3xl font-bold text-left">Login</h1>
        <Spacer y={4} />
        <form onSubmit={onSubmitHandler}>
          <div>
            <Input
              autoFocus
              label="Username"
              placeholder="Enter your username"
              variant="bordered"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <Spacer y={4} />
          <div>
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <Spacer y={4} />
          <div>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Remember Me
            </Checkbox>
          </div>
          <Spacer y={4} />
          <div>
            <Button type="submit" color="primary">
              Login
            </Button>
          </div>
          <Spacer y={4} />
          <p className="text-sm text-center my-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              {" "}
              Signup{" "}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
