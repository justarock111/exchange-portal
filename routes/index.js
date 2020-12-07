var express = require("express");
var router = express.Router();

var passport = require("passport");

//IMPORT MODEL
var User = require("../models/user");

//============
//INDEX ROUTE
//============

//HOME
router.get("/", (req, res) => {
res.render("landing");
});


//=============
//AUTH ROUTES
//=============


//REGISTER
router.get("/register", (req, res) => {
    res.render("authentication/register");
});

router.post("/register", (req, res) => {
  User.register(new User({username: req.body.username}),
  req.body.password,
  (err, user) => {
  if(err){
        req.flash("error", err.message);
        console.log("error registering new user" + err.message);
        res.redirect("/register");
  } else {
        req.flash("success", "Welcome to YelpCamp " + req.body.username);
        console.log("New user is registered but not authenticated");
        passport.authenticate("local") (req, res, () => {
            console.log("New user is authenticated");
            res.redirect("/schools");
        });
  }
  }
  );
});

//LOGIN
router.get("/login", (req, res) => {
    res.render("authentication/login");
});

router.post("/login",
    passport.authenticate("local", {
    successRedirect: "/schools",
    failureRedirect: "/login",
    failureFlash: true
    }),
    (req, res) => {

});

//LOGOUT
router.get("/logout", (req, res) => {
    req.flash("success", "Logged you out");
    req.logout();
    res.redirect("/login");
});



module.exports = router;