const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //Campos vacios
  if (username == "" || password == "") {
    res.render("passport/signup", {
      errorMessage: "El username o password no puede estar vacio"
    });
  }

  User.findOne({ username: username }, "username")
    .then(user => {
      res.render("passport/signup", {
        errorMessage: `El usuario ${user.username} ya existe`
      });
    })
    .catch(err => {
      throw err;
    });

  const newUser = User({
    username,
    password: hashPass
  });

  newUser
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("passport/signup", {
        errorMessage: "Something went wrong"
      });
    });
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
