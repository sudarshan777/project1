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
    articles: [
      {
        article: { type: Schema.Types.ObjectId, ref: "Article" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("User", userSchema);
