var express = require("express");
var router = express.Router({mergeParams: true});

//REQUIRE LIBRARIES
var FormData = require('form-data');
var https = require('https');
var fs = require('fs')
var { createWorker } = require('tesseract.js');
var multer = require('multer');
var axios = require('axios');
var moment = require('moment');

//MULTER SETUP
var storage = multer.diskStorage({
     destination: function (req, file, cb) {
        cb(null, 'uploads');
      },
      filename: function (req, file, cb) {
        console.log('FILE PASSED TO DISK STORAGE: ');
        console.log(file);
          const uniqueSuffix =   Math.round(Math.random() * 1E9) + '-' + Date.now()
          cb(null, file.originalname + '-' + uniqueSuffix)
        }
});

var upload = multer({ storage: storage });




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
var LocalModule = require("../models/localmodule");

//======================
//MODULE_MAPPING ROUTE
//======================

// middlewareObj.isLoggedIn
//RENDER NEW MODULE FORM(BY FACULTY)
router.get("/:faculty_id/module_mappings/new", middlewareObj.isLoggedIn, (req, res) => {
    res.render("modulemapping/new", {schoolId: req.params.school_id, facultyId: req.params.faculty_id});

});

//CREATE: NEW MODULE MAPPING(BY FACULTY)
router.post("/:faculty_id/module_mappings", [middlewareObj.isLoggedIn, upload.single('worksheet_image')], (req, res) => {

    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err){
        req.flash("error", "Cannot find Host University to add module mapping to");
        return res.redirect("back");
    }

    console.log("in here 1");
    if(!req.file || Object.keys(req.file).length === 0){
        console.log("no req.files");
        var contactHours = new ContactHours(req.body.contactHours);
        console.log("contact hours object");
        console.log(contactHours);
        var weightage = new Weightage(req.body.weightage);
        console.log("weightage object");
        console.log(weightage);
        var moduleMapping = new ModuleMapping(req.body.moduleMapping);
        moduleMapping.moduleCode = req.body.moduleMapping.moduleCodeOne + req.body.moduleMapping.moduleCodeTwo;
        moduleMapping.localModuleCode = req.body.moduleMapping.localModuleCodeOne + req.body.moduleMapping.localModuleCodeTwo;
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
        let file = req.file;
        console.log("file is found");
        console.log(file);

        console.log('gg to run async func');

        fs.readFile(`./uploads/${file.filename}`, (err, image) => {
            console.log('IMG THAT IS READ:')
            console.log(image);

            var parsedText, currString, startIndex, endIndex;
            if(err){
                console.log('FS READ FILE ERROR');
                console.log(err);
                return;
            }







       // runWorker();

        })


//       const paragraphsElements = res.paragraphs.map(({ text }) => {
//            const p = document.createElement('p');
//            p.textContent = text;
//            return p;
//       });



    //            file.mv("public/tmp/" + file.name, (err) => {
    //                if(err)
    //                    console.log(err);
    //
    //            });
   //             }

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

    });

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



//READ: SHOW ALL MODULE MAPPINGS OF A SCHOOL
router.get("/module_mappings", (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err){
    req.flash("error", "Error finding module mappings of this University.");
    res.redirect("/schools/" + req.params.school_id);
    } else {
        res.redirect("/schools/" + req.params.school_id + "/" + foundSchool.faculties[0]._id + "/module_mappings");
    }

    });


});





//READ: SHOW ALL MODULE MAPPINGS OF A SCHOOL
router.get("/:faculty_id/module_mappings", (req, res) => {
    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err){
    req.flash("error", "Error finding module mappings of this University.");
    res.redirect("/schools/" + req.params.school_id);
    } else {
        var foundFaculty = foundSchool.faculties.id(req.params.faculty_id);
        res.render("modulemapping/modulemappings", {school: foundSchool, faculty: foundFaculty});
    }

    });


});


//READ: SHOW ONE MODULE MAPPING OF A SCHOOL
router.get("/:faculty_id/module_mappings/:module_mapping_id", (req, res) => {
    console.log("MODULE DETAILS METHOD IS CALLED");
    console.log("school id is ");
    console.log(req.params.school_id);
    School.findById(req.params.school_id, (err, foundSchool) => {
    if(err){
    req.flash("error", "Error finding module mappings of this University.");
    return res.redirect("/schools/" + req.params.school_id);
    }

       var foundFaculty = foundSchool.faculties.id(req.params.faculty_id);
       var foundModule = foundFaculty.moduleMappings.id(req.params.module_mapping_id);
       var localModuleCode = foundModule.localModuleCode;
       LocalModule.findOne({"moduleCode": localModuleCode}, (err, localModule) => {
       if(err){
            req.flash("error", "Error finding NUS module.");
           return res.redirect("/schools/" + req.params.school_id);
       }


       if(localModule == null){ //|| !isToday(localModule.headers.date)){
           var currYear = new Date().getFullYear();
           var nextYear = currYear + 1;
           axios.get(`https:\/\/api.nusmods.com/v2/${currYear}-${nextYear}/modules/${localModuleCode}.json`)
                .then(result => {
                    console.log('RESULT DATA IS ');
                    console.log(result.data);
                    var newModule  = new LocalModule(result.data);
                    console.log('LOCAL MODULE OBJECT:');
                    console.log(newModule);
                    newModule.save()
                    .then(savedModule => {
                        console.log('NEW MODULE SAVED IS ');
                        console.log(newModule);
                       return res.render("modulemapping/show", {school: foundSchool, facultyId: req.params.faculty_id, moduleMapping: foundModule, localModule: savedModule, moment: moment});
                    });
                })
                .catch(err => {
                    req.flash("error", "Error when trying to retrieve local module information");
                    console.log('ERROR WHEN TRY TO RETRIEVE LOCAL MODULE INFORMATION');
                    console.log(err);
                   return res.render("modulemapping/show", {school: foundSchool, facultyId: req.params.faculty_id, moduleMapping: foundModule, moment: moment});
                });

       }

        console.log('MODULE GOTTEN IS ');
        console.log(localModule);

       res.render("modulemapping/show", {school: foundSchool, facultyId: req.params.faculty_id, moduleMapping: foundModule, localModule: localModule, moment: moment});

       });
    });
});

function isToday(dateString){
    const today = new Date().setHours(0, 0, 0, 0);
    const date = newDate(dateString).setHours(0, 0, 0, 0);
    return date == today;
}

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