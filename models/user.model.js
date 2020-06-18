const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: [
      {
        type: String,
      },
    ],
    articlesWritten: [
      { article: { type: Schema.Types.ObjectId, ref: "Article" } },
    ],
    commented: [
      {
        article: { type: Schema.Types.ObjectId, ref: "Article" },
        comment: { type: Schema.Types.Mixed, ref: "Article.comments" },
      },
    ],
    bookmarks: [{ article: { type: Schema.Types.ObjectId, ref: "Article" } }],
    following: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],
  },
  {
    timestamps: true,
  }
);



// Export the model
module.exports = mongoose.model("User", userSchema);
