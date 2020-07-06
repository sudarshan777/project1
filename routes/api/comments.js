const router = require("express").Router();
const Article = require("../../models/articles.model");
const User = require("../../models/user.model");
const Comment = require("../../models/comments.model");

const auth = require("../../middleware/auth");

// fetches all articles
router.get("/get/user/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.params.id })
      .populate("article", "user")
      .sort({ createAt: "desc" });

    console.log(comments);
    res.json(comments);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.get("/get/article/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.id })
      .populate("user", "name")
      .sort({ createAt: "desc" });
    res.json(comments);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.post("/post/article/:id", async (req, res) => {
  const userId = req.body.user;
  const articleId = req.params.id;

  try {
    if (Article.findById(articleId)) {
      const newComment = new Comment({
        body: req.body.body,
        user: userId,
        article: articleId,
      });
      await newComment.save();
      res.json("Comment added!");
    } else {
      res.json("Article cannot be found!");
    }
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});

// Edit comment
router.post("/edit/:commentId/user/:userId", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment && comment.user.toString() === req.params.userId) {
      comment.body = req.body.body;
      comment.save();
      res.json("Comment Updated");
    } else {
      res.json("Comment not found");
    }
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

// Delete comment
router.delete("/delete/:commentId/user/:userId", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).populate(
      "article",
      "user"
    );

    if (
      comment &&
      (comment.user.toString() === req.params.userId ||
        comment.article.user.toString() === req.params.userId)
    ) {
      await comment.deleteOne();
      res.json("Comment Deleted");
    } else {
      return res.json("Comment not present");
    }
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
module.exports = router;
