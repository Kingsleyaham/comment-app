const Comment = require("../models/Comment");

// fetch all comment
const fetchAll = (req, res) => {
  Comment.find({})
    .populate("user", "username image")
    .populate("replies.user", "username image")
    .sort({ score: "desc" })
    .lean()
    .exec(function (error, comments) {
      if (error) {
        console.log(error);
        return res.status(401).json({ error });
      }
      res.status(200).json(comments);
    });
};

// create new comment
const create = async (req, res) => {
  const userID = req.body.id;
  const content = req.body.comment;
  const score = 0;
  try {
    const comment = await Comment.create({ content, score, user: userID });
    res.status(201).json({ success: 1, comment: comment });
  } catch (error) {
    console.log(error);
  }
};
// update comment
const update = async (req, res) => {
  const ID = req.params.id;
  const replyId = req.body.comment.replyId;
  const content = req.body.comment.comment;

  if (!replyId) {
    try {
      const comment = await Comment.findByIdAndUpdate(ID, { content });
      res.status(201).json({ success: 1, message: comment });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const comment = await Comment.updateOne(
        { _id: ID, "replies._id": replyId },
        { $set: { "replies.$.content": content } }
      );
      res.status(201).json({ success: 1, message: comment });
    } catch (error) {
      console.log(error);
    }
  }
};

// save reply
const saveReply = async (req, res) => {
  const id = req.body.id;
  const userId = req.body.userId;
  const content = req.body.comment;
  const replyingTo = req.body.replyingTo;
  const createdAt = Date.now();
  const score = 0;
  try {
    const reply = await Comment.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: { content, createdAt, score, replyingTo, user: userId },
        },
      },
      { new: true }
    );

    res.status(201).json({ success: 1, reply: reply });
  } catch (error) {
    console.log(error);
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  const ID = req.params.id;
  const replyId = req.body.replyId;

  if (!replyId) {
    try {
      const comment = await Comment.findByIdAndDelete(ID);
      res
        .status(200)
        .json({ success: 1, message: "comment deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const comment = await Comment.findOneAndUpdate(
        { _id: ID },
        { $pull: { replies: { _id: replyId } } },
        { new: true }
      );
      res
        .status(201)
        .json({ success: 1, message: "comment deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }
};

const score = async (req, res) => {
  const ID = req.params.id;
  const replyId = req.body.comment.replyId;
  const score = req.body.comment.score;
  const type = req.body.comment.type;

  // new comment score
  const newScore = type === "increment" ? score + 1 : score - 1;

  if (!replyId) {
    try {
      const updateScore = await Comment.findByIdAndUpdate(ID, {
        score: newScore,
      });
      res.status(201).json({ success: 1, updateScore });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const updateScore = await Comment.updateOne(
        { _id: ID, "replies._id": replyId },
        { $set: { "replies.$.score": newScore } }
      );
      res.status(201).json({ success: 1, message: updateScore });
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports = {
  fetchAll,
  create,
  update,
  saveReply,
  deleteComment,
  score,
};
