var express = require("express");
var router = express.Router({mergeParams: true});

var axios = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");
var download = require('image-downloader')


//REQUIRE MIDDLEWARE
var middlewareObj =  require("../middleware");

//IMPORT MODEL
var School = require("../models/school");

//==================
//SCHOOL ROUTE
//==================

//RENDER NEW SCHOOL FORM
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    res.render("school/new");
});

//CREATE NEW SCHOOL
//router.post("/", middlewareObj.isLoggedIn, (req, res) => {
//    //Object requiredt: Make sure school object is submitted by the form
//    School.create(req.body.school, (err, newSchool) => {
//        if(err){
//        console.log("Error creating new school");
//        req.flash("error", "Error creating new school, Please check if the school exist.");
//        } else {
//        //Add in author details
//        newSchool.author.id = req.user._id;
//        newSchool.author.username = req.user.username;
//
//        axios.get(req.body.urlSchoolName)
//        .then((response) => {
//              if(response.status === 200){
//               const html = response.data;
//               const $ = cheerio.load(html);
//
//                newSchool.name =  $(".title_info h1").text().trim();
//
//                let location = $('.location').text().trim();
//                let endPoint = location.indexOf(" View map");
//                newSchool.location = location.substring(0, endPoint);
//
//                newSchool.ranking = $(".uni_stats .val").eq(0).text().replace(/[^0-9]/g,"");
//                newSchool.information = ($(".field-profile-advanced-overview").html() || $(".field-profile-overview").html());
//                console.log("school info is...");
//                console.log($(".field-profile-advanced-overview p").html());
//                newSchool.additionalInformationUrl = req.body.urlSchoolDoc;
//
//                //DOWNLOAD IMAGE
//                const logoUrl = $(".field-profile-logo").children('img').attr('src');
//                const options = {
//                  url: logoUrl,
//                  dest: 'public/assets'               // will be saved to /path/to/dest/image.jpg
//                }
//                download.image(options)
//                  .then(({ filename }) => {
//                    console.log('Saved to', filename);  // saved to /path/to/dest/image.jpg
//                    newSchool.logoPath = filename.substring(6);
//
//                     //SAVE SCHOOOL
//                    console.log("Added new school...");
//                    console.log(newSchool);
//                     newSchool.save();
//
//                     res.redirect("schools/");
//
//                  })
//                  .catch((err) => console.error(err))
//        }
//        })
//        .catch((err) => {
//                 console.log(err)
//                 req.flash("error", "Error getting school information from URL link");
//        })
//        .then(() => {
//         });
//        }
//    });
//});


//RENDER EDIT SCHOOL FORM
//Object Redirection: redirect by school id
router.get("/:school_id/edit", middlewareObj.isLoggedIn, (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
        if(err){
            console.log("Error finding target school to edit");
            req.flash("error", "School is not found!");
        } else {
            //Object that is passed in: school
            res.render("school/edit", {school: foundSchool});
        }
    });
});

//UPDATE SCHOOL
router.put("/:school_id", middlewareObj.isLoggedIn, (req, res) => {
    //Object required: School
    School.findByIdAndUpdate(req.params.school_id, req.body.school, (err, updatedSchool) => {
    if(err){
        console.log("Error updating target school");
        req.flash("error", "Error updating school");
    }
    res.redirect("/schools/" + req.params.school_id);
    });
});


//DELETE SCHOOL
//Object Redirection: redirect by school id
router.delete("/:school_id", middlewareObj.isLoggedIn, (req, res) => {
    School.findByIdAndRemove(req.params.school_id, (err) => {
        res.redirect("/schools");
    });
});


//READ: VIEW ONE SCHOOL
router.get("/:school_id", (req, res) => {
    School.findById(req.params.school_id).populate("comments").exec((err, foundSchool) => {
    if(err){
        console.log(err);
        req.flash("error", "The school you clicked on is not found");
    } else {
     res.render("school/show", {school: foundSchool});

    }
    });
});



//READ: VIEW ALL SCHOOLS
router.get("/", (req, res) => {
    School.find({}, (err, schools) => {
    if(err){
        console.log("Error displaying schools");
        req.flash("error", "Error retrieving schools from database");
    } else {
        res.render("school/schools", {schools: schools});
    }
    });
});





//SEARCH: SEARCH SCHOOL
router.post("/", (req, res) => {
    let query_string = new RegExp(req.body.query_string, "i");
    School.find({"institution" : query_string}).exec((err, schools) => {
     if(err){
         console.log("ERROR QUERYING IN SEARCH BAR: " + err);
         req.flash("error", "Error querying in search bar");
      } else {
         res.render("school/schools", {schools: schools});
      }


    })
})
module.exports = router;
