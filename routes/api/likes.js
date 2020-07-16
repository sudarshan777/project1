const router = require("express").Router();
const Article = require("../../models/articles.model");
const User = require("../../models/user.model");
const Like = require("../../models/likes.model");

const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

// fetches all articles
router.get("/user/all_articles/:id", async (req, res) => {
  try {
    const likes = await Like.find({ user: req.params.id })
      .select("-user")
      .populate("article", "title")
      .sort({ date: "desc" });

    res.json(likes);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.get("/article/all_users/:id", async (req, res) => {
  try {
    const likes = await Like.find({ article: req.params.id })
      .select("-article")
      .populate("user", "name")
      .sort({ date: "desc" });
    res.json(likes);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// router.get("/article/user/:id", async (req, res) => {
//   const userId = req.params.id;
//   const articleId = req.body.articleId;
//   try {
//     const like = await Like.findOne({ user: userId, article: articleId });
//     if (like) {
//       res.json("true");
//     } else {
//       res.json("false");
//     }
//   } catch (error) {
//     res.status(400).json("Error: " + error);
//   }
// });

router.post("/post/article/:id", async (req, res) => {
  const userId = req.body.user;
  const articleId = req.params.id;

  if (!userId && !articleId) {
    return res.status(400).json({ msg: "Data Missing" });
  }

  try {
    const article = await Article.findById(articleId);
    const user = await User.findById(userId);
    if (!user && !article) {
      return res.status(400).json({ msg: "Article or User not found" });
    }

    const like = await Like.findOne({ user: userId, article: articleId });

    if (like) {
      await like.deleteOne();
      res.json("Deleted");
    } else {
      const newLike = new Like({
        article: articleId,
        user: userId,
      });
      await newLike.save();
      res.json("Liked");
    }
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const like = await Like.findById(req.params.id);
    if (like) {
      await like.deleteOne();
      res.json("Like Deleted");
    } else {
      return res.json("Like not present");
    }
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
module.exports = router;
