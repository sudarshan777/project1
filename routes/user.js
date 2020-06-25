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
    const users = await User.find().select("-password");
    // .populate("articlesWritten")
    // .populate("following")
    // .populate("followers");
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("articlesWritten")
      .populate("following")
      .populate("followers")
      .populate('bookmarks','title');
    //   .populate("commented.article");

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});


router.post("/subscribe/:id", async (req, res) => {
  if (req.body.user === req.params.id) {
    return res.status(400).json({ msg: "You cannot follow yourself" });
  }
  try {
    await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $addToSet: { following: req.body.user } }
    );

    await User.findByIdAndUpdate(
      { _id: req.body.user },
      { $addToSet: { followers: req.params.id } }
    );

    res.json("Subscribed!");
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});
router.post("/unsubscribe/:id", async (req, res) => {
  if (req.body.user === req.params.id) {
    return res.status(400).json({ msg: "You cannot follow yourself" });
  }
  try {
    await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { following: req.body.user } }
    );

    await User.findByIdAndUpdate(
      { _id: req.body.user },
      { $pull: { followers: req.params.id } }
    );

    res.json("UnSubscribed!");
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json("User Deleted");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
