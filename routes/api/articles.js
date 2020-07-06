const router = require("express").Router();
const Article = require("../../models/articles.model");
const User = require("../../models/user.model");
const Like = require("../../models/likes.model");
const Comment = require("../../models/comments.model");

const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

// fetches all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("user", "name")
      .populate("likes", "user article")
      .populate("comments", "user body")
      .sort({ date: "desc" });

    res.json(articles);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});
// Adds single article
router.post("/add", async (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    body: req.body.body,
    user: req.body.user,
  });
  try {
    article = await newArticle.save();
    res.json(article);
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});
// Get single article

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "user",
      "name"
    );
    const Likes = article.likes.length;
    const Comments = article.comments.length;
    res.json({ article, Likes, Comments });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
// delete a  article
router.delete("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.json("Article not present");
  }
  try {
    await Like.find({ article: req.params.id }).deleteMany();
    await Comment.find({ article: req.params.id }).deleteMany();
    await Article.findByIdAndDelete(req.params.id);
    res.json("Article Deleted");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// update a article

router.post("/update/:id", async (req, res) => {
  try {
    await Article.updateOne(
      { _id: req.params.id },
      { $set: { title: req.body.title, body: req.body.body } }
    );
    res.json("Article updated!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
