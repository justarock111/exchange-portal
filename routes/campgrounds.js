var express = require("express");
var router = express.Router();

//REQUIRE MIDDLEWARE
var middlewareObj = require("../middleware");

//IMPORT MODEL
var Campground = require("../models/campground");

//==================
//CAMPGROUND ROUTE
//==================

//VIEW CAMPGROUNDS
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err)
            console.log("ERROR");
        else
            res.render("campground/campgrounds", {campgrounds: campgrounds});

    });
});

//RENDER NEW CAMPGROUND FORM
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    res.render("campground/new");
});

//CREATE NEW CAMPGROUND
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {id: req.user._id, username: req.user.username};
    console.log("Name is " + name);
    Campground.create({
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    }, (err, campground) => {
        if(err)
            console.log("ERROR");
        else {
            console.log("Sucessfully added");
            console.log(campground);
             res.redirect("/campgrounds");
            }
            });

});


//SHOW NEW CAMPGROUND
router.get("/:id", (req, res) => {
    var id = req.params.id;
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err)
            console.log("error populating comments of campground object or cg not found");
        else
            res.render("campground/show", {campground: foundCampground});
    })

});

//EDIT CAMPGROUND
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err)
            console.log("error finding the campground to edit");
        else
            res.render("campground/edit", {campground: foundCampground});
    })
});

//UPDATE CAMPGROUND
router.put("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
   Campground.findByIdAndUpdate(
   req.params.id,
   req.body.campground,
   (err, updatedCampground) => {
        res.redirect("/campgrounds/" + req.params.id);
   }
   )
});

//DESTROY CAMPGROUND
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req,res) => {
    console.log("Trying to delete cg");
    Campground.findByIdAndRemove(
    req.params.id,
    (err) => {
    res.redirect("/campgrounds");
    }
    )
});


module.exports = router;