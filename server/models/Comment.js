const mongoose = require("mongoose");
const { Schema } = mongoose;
const { model } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true, lowercase: true, trim: true },
    score: { type: Number, min: 0, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    replies: [
      {
        content: { type: String, lowercase: true, trim: true },
        createdAt: { type: Date, default: Date.now() },
        score: { type: Number, min: 0, default: 0 },
        replyingTo: { type: String, lowercase: true, trim: true },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
