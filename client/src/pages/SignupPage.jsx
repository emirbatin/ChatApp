import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../main";
import { Input, Spacer, Button } from "@nextui-org/react";

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <div className="min-w-[32rem] mx-auto">
      <div className="w-full p-0 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10">
        <h1 className="text-3xl font-bold text-start">Signup</h1>
        <Spacer y={4} />
        <form onSubmit={onSubmitHandler}>
          <div>
            <Input
              name="fullName"
              autoFocus
              label="Full Name"
              placeholder="Enter your full name"
              variant="bordered"
              value={user.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <Spacer y={4} />
          <div>
            <Input
              name="username"
              label="Username"
              placeholder="Enter your username"
              variant="bordered"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <Spacer y={4} />
          <div>
            <Input
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <Spacer y={4} />
          <div>
            <Input
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Please confirm your password"
              type="password"
              variant="bordered"
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <Spacer y={4} />
          <div>
            <select
              name="gender"
              onChange={handleChange}
              value={user.gender}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <Spacer y={4} />
          <div>
            <Button type="submit" color="primary">
              Signup
            </Button>
          </div>
          <Spacer y={4} />
          <p className="text-sm text-center my-2">
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
