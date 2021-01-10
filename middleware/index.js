//REQUIRE MODELS
var School = require("../models/school");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
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