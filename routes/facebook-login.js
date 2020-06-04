const router = require("express").Router();
const passport = require("passport");
const dotenv = require("dotenv");
const strategy = require("passport-facebook");

const User = require("../models/user.model");

const FacebookStrategy = strategy.Strategy;

dotenv.config();
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      const picture = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`;
      console.log(picture);
      const userData = {
        name: first_name + " " + last_name,
        email: email,
      };
      new User(userData).save();
      done(null, profile);
    }
  )
);

router.get(
  "/authenticate/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/authenticate/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/success",
    failureRedirect: "/fail",
  })
);

router.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

router.get("/success", (req, res) => {
  res.send("Success");
  //res.render("profile", { user: req.user });
});
module.exports = router;
