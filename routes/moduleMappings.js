var express = require("express");
var router = express.Router({mergeParams: true});

//REQUIRE LIBRARIES
var tesseract = require("node-tesseract-ocr");

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}

//REQUIRE MIDDLEWARE
var middlewareObj = require("../middleware");

//REQUIRE MODEL
var ModuleMapping = require("../models/modulemapping");
var School = require("../models/school");
var Faculty = require("../models/faculty");
var ContactHours = require("../models/contacthours");
var Weightage = require("../models/weightage");

//======================
//MODULE_MAPPING ROUTE
//======================

//RENDER NEW MODULE FORM(BY FACULTY)
router.get("/:faculty_id/module_mappings/new", middlewareObj.isLoggedIn, (req, res) => {
    res.render("modulemapping/new", {schoolId: req.params.school_id, facultyId: req.params.faculty_id});

});

//CREATE: NEW MODULE MAPPING(BY FACULTY)
router.post("/:faculty_id/module_mappings", middlewareObj.isLoggedIn, (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err){
        req.flash("error", "Cannot find Host University to add module mapping to");
        res.redirect("back");
    } else {
       console.log("in here 1");
        if(!req.files || Object.keys(req.files).length === 0){
            console.log("no req.files");
             var contactHours = new ContactHours(req.body.contactHours);
             console.log("contact hours object");
              console.log(contactHours);
             var weightage = new Weightage(req.body.weightage);
             console.log("weightage object");
             console.log(weightage);
              var moduleMapping = new ModuleMapping(req.body.moduleMapping);
              moduleMapping.contactHours = contactHours;
              moduleMapping.weightage = weightage;
              moduleMapping.author.id = req.user._id;
              moduleMapping.author.username = req.user.username;
              moduleMapping.save();

                console.log("module mapping object");
                       console.log(moduleMapping);
               var foundFaculty = foundSchool.faculties.id(req.params.faculty_id);
               console.log("faculty id is...");
               console.log(req.params.faculty_id);
               console.log("found faculty is ...");
               console.log(foundFaculty);

                 foundFaculty.moduleMappings.push(moduleMapping);

                 console.log("updated module mappings is ");
                 console.log(foundFaculty.moduleMappings);

                 foundFaculty.save();

                  foundSchool.save((err, user) => {
                       if(err)
                           console.log("Error saving updated school information");
                       else {
                            console.log("School is saved");
                            console.log(foundSchool);
                            res.redirect("/schools/" + req.params.school_id + "/module_mappings");
                      }
                      });
        } else {
           console.log("in here 2");
            let file = req.files.worksheet_image;
            console.log("files is found");
            console.log(file.name);
            file.mv("public/tmp/" + file.name, (err) => {
                if(err)
                    console.log(err);

            });
            }

//             tesseract.recognize(req.body.worksheet_image, config)
//             .then(text => {
//             console.log("in here 1");
//              console.log("Result:", text);
//              });
//
//           req.flash("success", "Text from image successfully extracted. Do check your mapping post for any errors.");


      }
      })
      .catch(error => {
        console.log(error.message)
      })


//    var contactHours = new ContactHours(req.body.contactHours);
//    console.log("contact hours object");
//    console.log(contactHours);
//    var weightage = new Weightage(req.body.weightage);
//    console.log("weightage object");
//        console.log(weightage);
//    var moduleMapping = new ModuleMapping(req.body.moduleMapping);
//    moduleMapping.contactHours = contactHours;
//    moduleMapping.weightage = weightage;
//    moduleMapping.author.id = req.user._id;
//    moduleMapping.author.username = req.user.username;
//   moduleMapping.save();



});

//READ: SHOW ALL MODULE MAPPINGS OF A SCHOOL
router.get("/module_mappings", (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err){
    req.flash("error", "Error finding module mappings of this University.");
    res.redirect("/schools/" + req.params.school_id);
    } else {
        res.render("modulemapping/modulemappings", {school: foundSchool});
    }

    });


});


//READ: SHOW ONE MODULE MAPPING OF A SCHOOL
router.get("/:faculty_id/module_mappings/:module_mapping_id", (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err){
    req.flash("error", "Error finding module mappings of this University.");
    res.redirect("/schools/" + req.params.school_id);
    } else {
       var foundFaculty = foundSchool.faculties.id(req.params.faculty_id);
       var foundModule = foundFaculty.moduleMappings.id(req.params.module_mapping_id);
       res.render("modulemapping/show", {schoolId: req.params.school_id, facultyId: req.params.faculty_id, moduleMapping: foundModule});
    }

    });
});

//RENDER UPDATE FORM
router.get("/:faculty_id/module_mappings/:module_id/edit", middlewareObj.checkModuleOwnership, (req, res) => {
    console.log("rendering edit form...");
    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err)
        console.log("Error finding Host University");
    else {
        const foundFaculty = foundSchool.faculties.id(req.params.faculty_id);
        const foundModule = foundFaculty.moduleMappings.id(req.params.module_id);
        res.render("modulemapping/edit", {schoolId: req.params.school_id, facultyId: req.params.faculty_id, moduleMapping: foundModule});
        }

    });

});

//UPDATE MODULE MAPPING
router.put("/:faculty_id/module_mappings/:module_id", middlewareObj.checkModuleOwnership, (req, res) => {
   School.findById(req.params.school_id, (err, foundSchool) => {
       if(err){
           req.flash("error", "Cannot find Host University to add module mapping to");
           res.redirect("back");
       } else {
       var contactHours = new ContactHours(req.body.contactHours);
       var weightage = new Weightage(req.body.weightage);
       var moduleMapping = new ModuleMapping(req.body.moduleMapping);
       moduleMapping.contactHours = contactHours;
       moduleMapping.weightage = weightage;
       moduleMapping.author.id = req.user._id;
       moduleMapping.author.username = req.user.username;
      moduleMapping.save();
       var foundFaculty = foundSchool.faculties.id(req.params.faculty_id);
          foundFaculty.moduleMappings.pull(req.params.module_id);
         foundFaculty.moduleMappings.push(moduleMapping);

          foundSchool.save((err, user) => {
               if(err)
                   console.log("Error saving updated school information");
               else {
                    console.log("School is saved");
                               res.redirect("/schools/" + req.params.school_id + "/module_mappings");
              }
          });
       }
       });
});

//DELETE MODULE MAPPING
router.delete("/:faculty_id/module_mappings/:module_id", middlewareObj.checkModuleOwnership, (req, res) => {

  School.findOneAndUpdate(
   { "_id": req.params.school_id, "faculties._id": req.params.faculty_id},
   {"$pull": {"faculties.$.moduleMappings": {"_id": req.params.module_id}}},
    function(err, school){
   if(err)
        console.log("Error deleting module mapping");
   else
        console.log(school);
   res.redirect("/schools/" + req.params.school_id + "/module_mappings" );
   }
   );

});

module.exports = router;