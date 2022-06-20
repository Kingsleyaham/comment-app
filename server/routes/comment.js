const { Router } = require("express");
// const Comment = require("../models/Comment");
const commentController = require("../controllers/CommentController");

const router = Router();

// fetch all comments
router.get("/", commentController.fetchAll);

// create new comment
router.post("/", commentController.create);

// update comment
router.put("/:id", commentController.update);

// save comment reply
router.post("/reply", commentController.saveReply);

// delete comment
router.delete("/:id", commentController.deleteComment);

// increment and decrement comment score
router.put("/likes/:id", commentController.score);

module.exports = router;
