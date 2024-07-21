const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const saltRounds = 12;

// Kullanıcı Kaydı
exports.createUser = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let imagePath;

    if (req.files && req.files.image) {
      const uploadDir = "uploads";
      const fileExtension = path
        .extname(req.files.image[0].originalname)
        .toLowerCase();
      if (![".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        return res
          .status(400)
          .json({ message: "Only .png, .jpg and .jpeg format allowed" });
      }
      const imageFileName = `${crypto
        .randomBytes(16)
        .toString("hex")}${fileExtension}`;
      imagePath = `${uploadDir}/${imageFileName}`;
      await fs.promises.rename(
        req.files.image[0].path,
        path.join(__dirname, "..", imagePath)
      );
    }

    const user = await User.create({
      username: validator.escape(username),
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      imagePath,
    });

    const token = jwt.sign({ id: user.uuid }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    if (imagePath) {
      user.imageUrl = `${req.protocol}://${req.get("host")}/${imagePath}`;
    }

    res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Error creating user" });
  }
};

// Kullanıcı Girişi
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
};

// Tüm Kullanıcıları Getir (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const users = await User.find({}).select("username email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Kullanıcı ID'sine Göre Getir
exports.getUserById = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.params.id).select(
      "username email imagePath"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userObject = user.toObject();
    if (userObject.imagePath) {
      userObject.imageUrl = `${req.protocol}://${req.get("host")}/${
        userObject.imagePath
      }`;
    }
    res.json(userObject);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Kullanıcı Güncelleme
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = req.body;

    if (req.files && req.files.image) {
      const oldImagePath = user.imagePath
        ? path.join(__dirname, "..", user.imagePath)
        : null;
      if (oldImagePath && fs.existsSync(oldImagePath)) {
        await fs.promises.unlink(oldImagePath);
      }
      const uploadDir = "uploads";
      const fileExtension = path
        .extname(req.files.image[0].originalname)
        .toLowerCase();
      if (![".png", ".jpg", ".jpeg"].includes(fileExtension)) {
        return res
          .status(400)
          .json({ message: "Only .png, .jpg and .jpeg format allowed" });
      }
      const imageFileName = `${crypto
        .randomBytes(16)
        .toString("hex")}${fileExtension}`;
      user.imagePath = `${uploadDir}/${imageFileName}`;
      await fs.promises.rename(
        req.files.image[0].path,
        path.join(__dirname, "..", user.imagePath)
      );
      user.imageUrl = `${req.protocol}://${req.get("host")}/${user.imagePath}`;
    }

    if (updates.password) {
      if (updates.password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }
      user.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const allowedUpdates = ["username", "email"];
    allowedUpdates.forEach((update) => {
      if (updates[update]) {
        user[update] = validator.escape(updates[update]);
      }
    });

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error updating user" });
  }
};

// Kullanıcı Silme (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Kullanıcı profili getirme
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error updating profile" });
  }
};
