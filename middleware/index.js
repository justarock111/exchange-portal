//REQUIRE MODELS
var School = require("../models/school");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req, res, next){
if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error", "Campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkSchoolOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        School.findById(req.params.school_id, (err, foundSchool) => {
            if(err){
              req.flash("School selected is not found");
              res.redirect("back");
            } else {
            if(foundSchool.author.id.equals(req.user._id))
                next();
            else {
                req.flash("error", "You do not have permission to do that as you did not add the school :)");
                res.redirect("back");
            }

            }
                });
    } else {
         req.flash("error", "You need to be logged in to do that");
         res.redirect("back");
    }
}

middlewareObj.checkModuleOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        School.findById(req.params.school_id, (err, foundSchool) => {
            if(err){
              console.log(err);
              req.flash("School selected is not found");
              res.redirect("back");
            } else {
            var foundFaculty = foundSchool.faculties.id(req.params.faculty_id);
            var foundModule = foundFaculty.moduleMappings.id(req.params.module_id);
            if(foundModule && foundModule.author.id.equals(req.user._id))
            next();
            else
            res.redirect("back");
        }
        });
    } else {
         req.flash("error", "You need to be logged in to do that");
         res.redirect("back");
    }
}

module.exports = middlewareObj;