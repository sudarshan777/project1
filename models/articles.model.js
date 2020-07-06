const { model, Schema } = require("mongoose");

const articleSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 5,
      max: 100,
      require: true,
    },
    body: {
      type: String,
      trim: true,
      max: 2000,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Article = model("Article", articleSchema);

module.exports = Article;
