const mongoose = require("mongoose");
const { Schema } = mongoose;
const { model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be atleast 3 characters"],
      lowercase: true,
      unique: true,
    },
    image: { type: String, default: "placeholder.png" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
