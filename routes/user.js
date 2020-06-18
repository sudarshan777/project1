const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// User Model
const User = require("../models/user.model");
let Article = require("../models/articles.model");

// @route GET /auth/user
// @desc get user data
// @access private

// router.get("/user", auth, (req, res) => {
//   User.findById(req.user.id)
//     .select("-password")
//     .then((user) => res.json(user));
// });

// @route GET /user
// @desc get user data
// @access public
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); //.populate(
    //   "articlesWritten.article"
    // );
    //   .populate("commented.article");
    console.log(user.articlesWritten[0].article);

    const article = await Article.findById(user.articlesWritten[0].article);

    res.json({ user, article });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
