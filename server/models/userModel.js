const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    uuid: { type: String, default: uuidv4, unique: true },
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} geçerli bir e-posta adresi değil!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    imagePath: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      default: false, // Varsayılan olarak isAdmin false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
