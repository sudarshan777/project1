const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
//express server
const app = express();

// middleware
app.use(cors());
app.use(express.json());
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

app.use("/signup", signupRouter);
app.use("/auth", authRouter);

//Starts listening to server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
