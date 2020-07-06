const { model, Schema } = require("mongoose");

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    article: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Article",
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
