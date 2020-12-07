var express = require("express");
var router = express.Router({mergeParams:true});

//MIDDLEWARE OBJECT
var middlewareObj = require("../middleware");

//IMPORT MODEL
var School = require("../models/school");
var Link = require("../models/link");

//CREATE: RENDER NEW FORM
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
        res.render("additionalInformation/new", {school: foundSchool});
    });
});

//CREATE: CREATE NEW LINK
router.post("/", middlewareObj.isLoggedIn, (req, res) => {

    School.findById(req.params.school_id, (err, foundSchool) => {
       foundSchool.links.push(
      { title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        author: {
        id: req.user._id,
        username: req.user.username
        }
        }
       );
       foundSchool.save();
       console.log(foundSchool);
       res.redirect("/schools/" + req.params.school_id + "/additional_information")
    });
});



//READ: SHOW ADDITIONAL INFORMATION AND USEFUL LINKS OF SCHOOL
router.get("/", (req, res) => {

    School.findById(req.params.school_id, (err, foundSchool) => {
   res.render("additionalInformation/informationAndLinks", {school: foundSchool});
    })
});

//EDIT: RENDER EDIT(CREATE AND DELETE) FORM FOR ADDITIONAL INFORMATION OF SCHOOL
router.get('/edit', middlewareObj.isLoggedIn, (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
     res.render("additionalInformation/edit", {school: foundSchool})
    })
});

//DELETE: DELETE LINK
router.delete("/:link_id", middlewareObj.isLoggedIn, (req, res) => {
     School.findOneAndUpdate(
       {"_id": req.params.school_id},
       {"$pull": {"links": {"_id": req.params.link_id}}},
       (err, school) => {
       if(err)
        req.flash("error", "Error deleting link");
       else
        req.flash("success", "Link is successfully deleted");
        console.log(school);
       res.redirect("/schools/" + req.params.school_id + "/additional_information");
       }
)
});

//READ: REDIRECT TO USEFUL LINKS OF SCHOOL
router.get("/:link_id", (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
        let foundLink = foundSchool.links.id(req.params.link_id);
        console.log(foundLink);
        res.render("additionalInformation/show", {school: foundSchool, link: foundLink});
    })

})


module.exports = router;