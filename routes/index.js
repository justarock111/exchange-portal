var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require("passport");

//IMPORT MODEL
var User = require("../models/user");

//============
//INDEX ROUTE
//============

//HOME
router.get("/", (req, res) => {
res.redirect("/schools")
});


//=============
//AUTH ROUTES
//=============


//REGISTER
router.get("/register", (req, res) => {
    res.render("authentication/register");
});

router.post("/register", (req, res) => {
     const { username, password } = req.body;
      User.create({ username, password })
        .then(user => {
          req.login(user, err => {
            if (err) next(err);
            else {
            req.flash("success", "Welcome " + username)
            res.redirect("/schools");
            }
          });
        })
        .catch(err => {
          if (err.name === "ValidationError") {
            console.log("USERNAME IS TAKEN");
            req.flash("error", "Sorry, that username is already taken. Please choose another username.");
            res.redirect("/register");
          } else next(err);
        });
});

//LOGIN
router.get("/login", (req, res) => {
    res.render("authentication/login");
});

router.post("/login",  passport.authenticate("local", {
                          successRedirect: "/schools",
                          failureRedirect: "/login",
                          failureFlash: true,
                          }), (req, res) => {
});

//LOGOUT
router.get("/logout", (req, res) => {
    req.flash("success", "Logged you out");
    req.logout();
    res.redirect("/login");
});



module.exports = router;