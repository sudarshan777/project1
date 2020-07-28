const {
  model,
  Schema
} = require("mongoose");
let userSchema = new Schema({
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
  role: [{
    type: String,
  }, ],
  hobbies: {
    type: Array,
  },
  skills: {
    type: Array
  },
  ratings: {
    type: Number,
    max: 5,
    default: 0
  },
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true,
    default: [],
  }, ],
  following: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: []
  }, ],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: []
  }, ],
}, {
  timestamps: true,
});

// Export the model

const User = model("User", userSchema);

module.exports = User;