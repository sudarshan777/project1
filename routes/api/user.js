const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/user.model");
let Article = require("../../models/articles.model");

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
    const users = await User.find()
      .select("-password")
      // .populate("articlesWritten")
      .populate("following", "name")
      .populate("followers", "name");
    res.json(users);
  } catch (error) {
    res.status(400).json({
      message: err
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    // .populate("following", "name")
    // .populate("followers", "name")
    // .populate("bookmarks", "title");
    //   .populate("commented.article");

    res.json(user);
  } catch (err) {
    res.status(400).json({
      message: err
    });
  }
});
router.get("/followers/:id", async (req, res) => {
  try {
    const followers = await User.findById(req.params.id)
      .select("followers")
      .populate("followers", "name");

    res.json(followers);
  } catch (error) {
    res.status(400).json({
      Error: error
    });
  }
});

router.get("/articlesWritten/:id", async (req, res) => {
  try {
    const articles = await Article.find({
      user: req.params.id
    }).populate(
      "user",
      "name"
    );
    res.json(articles);
  } catch (error) {
    res.status(400).json({
      Error: error
    });
  }
});

router.get("/following/:id", async (req, res) => {
  try {
    const following = await User.findById(req.params.id)
      .select("following")
      .populate("following", "name");

    res.json(following);
  } catch (error) {
    res.status(400).json({
      Error: error
    });
  }
});
router.get("/bookmarks/:id", async (req, res) => {
  try {
    const bookmarks = await User.findById(req.params.id)
      .select("bookmarks")
      .populate("bookmarks", "title");
    res.json(bookmarks);
  } catch (error) {
    res.statue(400).json("Error: " + error);
  }
});

router.post("/:id/follow", async (req, res) => {
  const userId = req.params.id;
  const followUserId = req.body.user;
  if (userId === followUserId) {
    return res.status(400).json({
      msg: "You cannot follow yourself"
    });
  }
  if (!userId || !followUserId) {
    return res.status(400).json({
      msg: "You are missing data"
    });
  }

  try {
    const user = await User.findById(userId).populate("following", "_id");
    const followUser = await User.findById(followUserId).populate(
      "followers",
      "_id"
    );
    if (user && followUser) {
      if (
        user.following.find((u) => u._id.toString() === followUserId) &&
        followUser.followers.find((u) => u._id.toString() === userId)
      ) {
        user.following = user.following.filter(
          (u) => u._id.toString() !== followUserId
        );

        followUser.followers = followUser.followers.filter(
          (u) => u._id.toString() !== userId
        );
        res.json("Removed Follow !");
      } else {
        user.following.push(followUserId);
        followUser.followers.push(userId);
        res.json("Followed !");
      }
      await user.save();
      await followUser.save();
    }
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});

router.post("/bookmark/:id", async (req, res) => {
  const userId = req.params.id;
  const articleId = req.body.articleId;
  if (!userId || !articleId) {
    return res.status(400).json({
      msg: "You are missing data"
    });
  }

  try {
    const user = await User.findById(userId).populate("bookmarks", "_id");
    const article = await Article.findById(articleId);
    if (user && article) {
      if (user.bookmarks.find((u) => u._id.toString() === articleId)) {
        user.bookmarks = user.bookmarks.filter(
          (article) => article._id.toString() !== articleId
        );

        res.json("Removed Bookmark !");
      } else {
        user.bookmarks.push(articleId);
        res.json("Bookmarked !");
      }
    }
    await user.save();
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


router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.updateOne({
      _id: req.params.id
    }, {
      $set: {
        name: req.body.name,
        role: req.body.role,
        hobbies: req.body.hobbies,
        skills: req.body.skills
      }
    })
    res.json(updatedUser)
  } catch (err) {
    res.json({
      message: err
    })
  }
})

module.exports = router;