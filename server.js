const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

require("dotenv").config();
//express server
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
// setup database

const uri = process.env.MONGOLAB_URI;
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log("DB connected!")
);

// Use routes
const signupRouter = require("./routes/signup");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/api/user");
const facebookRouter = require("./routes/facebook-login");
const articleRouter = require("./routes/api/articles");
const likeRouter = require("./routes/api/likes");
const commentRouter = require("./routes/api/comments");

app.use(passport.initialize());
app.use("/signup", signupRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/", facebookRouter);
app.use("/articles", articleRouter);
app.use("/like", likeRouter);
app.use("/comments", commentRouter);

//Starts listening to server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
