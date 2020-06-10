const router = require("express").Router();
let Article = require("../models/articles.model");
const auth = require("../middleware/auth");

router.route("/").get((req, res) => {
  Article.find()
    .populate("user", "name")
    .then((articles) => res.json(articles))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/add", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const user = req.body.user;

  const newArticle = new Article({
    title,
    body,
    user,
  });

  newArticle
    .save()
    .then(() => res.json("Article added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/:id", (req, res) => {
  Article.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "name",
      },
    })
    .then((article) => res.json(article))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/:id", (req, res) => {
  Article.findByIdAndDelete(req.params.id)
    .then(() => res.json("Article Deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/update/:id", (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      article.title = req.body.title;
      article.body = req.body.body;

      article
        .save()
        .then(() => res.json("Article updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/comment/:id", (req, res) => {
  Article.findById(req.params.id)
    .then((article) => {
      article.comments.push({
        body: req.body.body,
        user: req.body.user,
      });

      article
        .save()
        .then(() => res.json("Comment updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
module.exports = router;
