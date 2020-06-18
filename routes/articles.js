const router = require("express").Router();
let Article = require("../models/articles.model");
let User = require("../models/user.model");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// fetches all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("user", "name")
      .populate("comments.user", "name");
    res.json({ articles });
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

  // const comment = { body: req.body.body, user: req.body.user };
  // try {
  //   await Article.findOneAndUpdate(
  //     { _id: req.params.id },
  //     { $push: { comments: comment } }
  //   );

  try {
    article = await newArticle.save();
    await User.findOneAndUpdate(
      { _id: newArticle.user },
      { $push: { articlesWritten: { article } } }
    );
    res.json({ article });
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});
// Get single article

router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("user", "name")
      .populate("comments.user", "name");
    // await article.populate("user", "name").execPopulate();
    // await article.populate("comments", "user", "name").execPopulate();

    res.json(article);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
// delete a  article
router.delete("/:id", async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
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

router.post("/comment/:id", async (req, res) => {
  const id = new mongoose.Types.ObjectId();
  const comment = { _id: id, body: req.body.body, user: req.body.user };
  try {
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: comment } }
    );

    await User.findOneAndUpdate(
      { _id: comment.user },
      { $push: { commented: { article, comment: id } } }
    );
    res.json({ article });
    res.json("Comment added!");
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});

router.post("/like/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    article.like();
    res.status(201).json({ article });
  } catch (error) {
    res.status(400).json("Error: " + err);
  }
});
module.exports = router;
