import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
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
  const { authUser } = useSelector((store) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setUser({ ...user, gender: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!user.fullName.trim() || !user.username.trim() || !user.password || !user.confirmPassword || !user.gender) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, {
        fullName: user.fullName.trim(),
        username: user.username.trim(),
        password: user.password,
        confirmPassword: user.confirmPassword,
        gender: user.gender
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
            <label className="block text-sm font-medium text-gray-700">
              Choose Your Gender
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="male"
                name="gender"
                value="male"
                checked={user.gender === "male"}
                onChange={handleCheckbox}
                className="mr-2"
              />
              <label htmlFor="male" className="mr-4">
                Male
              </label>
              <input
                type="checkbox"
                id="female"
                name="gender"
                value="female"
                checked={user.gender === "female"}
                onChange={handleCheckbox}
                className="mr-2"
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
          <Spacer y={4} />
          <div>
            <Button type="submit" color="primary">
              Signup
            </Button>
          </div>
          <Spacer y={4} />
          <p className="text-sm text-center my-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
