import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { broadcastNewUser } from "../socket/socket.js";

export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ message: "Username already exit try different" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // profilePhoto
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      password: hashedPassword,
      profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
      gender,
    });
    
    // Yeni kullanıcıyı tüm online kullanıcılara bildir
    broadcastNewUser({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePhoto: newUser.profilePhoto,
      gender: newUser.gender,
    });
    
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Failed to create account" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect username or password",
        success: false,
      });
    }
    
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      profilePhoto: user.profilePhoto,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Failed to logout" });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .lean();
    return res.status(200).json(otherUsers);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Failed to get users" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .select("-password")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
