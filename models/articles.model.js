const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
      required: true,
      trim: true,
      maxlength: 500,
    },
    body: {
      type: String,
      default: "",
      required: true,
      trim: true,
      maxlength: 2000,
    },
    user: {
      userName: { type: String, required: true },
      id: { type: String, required: true },
    },
    date: { type: Date, default: Date.now },
    comments: [
      {
        body: { type: String, default: "", maxlength: 1000 },
        user: {
          userName: { type: String, required: true },
          id: { type: String, required: true },
        },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Exercise;
