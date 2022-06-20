const User = require("../models/User");
const multer = require("multer");

function fileFilter(req, file, cb) {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("only .png, .jpg and .jpeg format allowed"));
  }
}

const storage = multer.diskStorage({
  destination: "./../public/img/avatars/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

const maxSize = 1 * 1024 * 512;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

const avatarUpload = upload.single("avatar");

const handleError = (err) => {
  let error = "";
  let errorMsg = err.message;

  if (errorMsg.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error = properties.message;
    });
  }

  return error;
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();

    res.status(200).json({ success: 1, user });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  // console.log(req);
  try {
    let user = await User.findOne({ username: req.body.username })
      .lean()
      .select("_id username");
    if (!user) {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ success: 1, user });
    } else {
      res.status(200).json({ success: 1, user });
    }
  } catch (err) {
    // console.log(error);
    const error = handleError(err);
    res.status(401).json({ error });
  }
};

const uploadImage = (req, res) => {
  avatarUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    const id = req.params.id;
    User.findByIdAndUpdate(id, { image: req.file.filename })
      .then((data) => {
        console.log("image uploaded successfully");
        res.status(200).json({ data });
      })
      .catch((err) => console.log(err));
  });
};

module.exports = {
  getUser,
  loginUser,
  uploadImage,
};
