var express = require("express");
var router = express.Router({mergeParams: true});

//IMPORT MODELS
var School = require("../models/school");
var Comment = require("../models/comment");

//REQUIRE MIDDLEWARE
var middlewareObj = require("../middleware");
// ====================
// COMMENTS ROUTES
// ====================


//RENDER NEW COMMENT FORM
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
        if(err)
            console.log(err);
        else{
        console.log(foundSchool);
           res.render("comments/new", {school: foundSchool});
        }

    })


});

//ADD NEW COMMENT
router.post("/",  middlewareObj.isLoggedIn, (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
        Comment.create(req.body.comment, (err, comment) => {
       if(err){
       req.flash("error", "Something went wrong when creating new comment");
        console.log("error in creating comment");

       } else {
       comment.author = {id: req.user._id, username: req.user.username};
       console.log(comment.author);
       comment.save();
        foundSchool.comments.push(comment);
        foundSchool.save();

        req.flash("success", "Successfully added new comment");
        res.redirect("/schools/" + foundSchool._id);
       }

       })
    })
});

//EDIT COMMENT
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findById(
    req.params.comment_id,
    (err, foundComment) => {
    if(err)
        console.log("Error finding target comment to edit");
    else
        res.render("comments/edit", {comment: foundComment, schoolId: req.params.school_id});
    }
    )
});

//UPDATE COMMENT
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
    if(err){
        req.flash("error", "Editing new comment");
        req.redirect("back");
    } else {
        req.flash("success", "Successfully edited comment");
        res.redirect("/schools/" + req.params.school_id);
    }
    }
    )
});

//DESTROY COMMENT
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(
    req.params.comment_id,
    (err) => {
    if(err){
     req.flash("error", "Error deleting comment");
     console.log("Error deleting comment");
     res.redirect("back");
    }  else {
        req.flash("success", "Comment deleted");
        res.redirect("/schools/" + req.params.school_id);
    }
    }
    )
})


module.exports = router;