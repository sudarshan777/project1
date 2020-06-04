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
  },
  () => console.log("DB connected!")
);

// Use routes
const signupRouter = require("./routes/signup");
const authRouter = require("./routes/auth");
app.use(passport.initialize());
app.use("/signup", signupRouter);
app.use("/auth", authRouter);
const facebookRouter = require("./routes/facebook-login");
app.use("/", facebookRouter);

//Starts listening to server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
