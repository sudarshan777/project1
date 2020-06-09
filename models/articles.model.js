const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      default: "",

      trim: true,
      maxlength: 500,
    },
    body: {
      type: String,
      default: "",

      trim: true,
      maxlength: 2000,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    comments: [
      {
        body: { type: String, default: "", maxlength: 1000 },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
