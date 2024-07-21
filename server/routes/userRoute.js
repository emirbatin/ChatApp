const express = require("express");

const User = require("../models/userModel");
const userController = require("../controllers/userController");
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const authenticateToken = require("../middlewares/authenticateToken");

const {
  authenticateUser,
  authenticateAdmin,
} = require("../middlewares/authMiddleware");

const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/secret", authenticateToken, (req, res) => {
  res.send("Gizli bilgi, sadece doğrulanmış kullanıcılar görebilir.");
});

// Public routes
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

// Authenticated user routes
router.get("/profile", authenticateUser, userController.getUserProfile);
router.put("/profile", authenticateUser, userController.updateUserProfile);

//Admin routes
router.get(
  "/",
  authenticateUser,
  authenticateAdmin,
  userController.getAllUsers
);
router.get(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  userController.getUserById
);
router.put(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  userController.updateUser
);
router.delete(
  "/:id",
  authenticateUser,
  authenticateAdmin,
  userController.deleteUser
);
router.patch(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  authenticateUser,
  authenticateAdmin,
  updateUser
);
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  authenticateUser,
  authenticateAdmin,
  createUser
);
module.exports = router;
