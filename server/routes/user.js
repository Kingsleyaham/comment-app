const { Router } = require("express");
const userController = require("../controllers/UserController");

const router = Router();

// create new user or log in if user exist
router.post("/", userController.loginUser);

// get logged in user details
router.get("/:username", userController.getUser);

// upload user profile image
router.put("/image/upload/:id", userController.uploadImage);

module.exports = router;
