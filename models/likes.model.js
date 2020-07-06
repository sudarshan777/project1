const { model, Schema } = require("mongoose");

const LikeSchema = new Schema({
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
  date: { type: Date, default: Date.now },
});

const Like = model("Like", LikeSchema);

module.exports = Like;
