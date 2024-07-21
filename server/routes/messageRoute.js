const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send/:id", authenticateUser, sendMessage);
router.get("/:id", authenticateUser, getMessages);

module.exports = router;
