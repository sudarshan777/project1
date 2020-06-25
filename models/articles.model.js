const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
      min: 5,
      max: 100,
    },
    body: {
      type: String,
      default: "",
      trim: true,
      max: 2000,
    },
    likes: {
      type: Number,
      default: 0,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    comments: [
      {
        body: {
          type: String,
          default: "",
          max: 1000,
          trim: true,
          min: 10,
          required: true,
        },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);
articleSchema.methods.like = function () {
  this.likes++;
  return this.save();
};
articleSchema.methods.unlike = function () {
  this.likes--;
  return this.save();
};

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
