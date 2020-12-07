const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var facultySchema = require("./faculty").schema;

const facultyNames = ["Art & Social Sciences", "Business", "Computing", "Science",  "Engineering", "Design & Environment", "Public Health", "Public Policy", "Integrative Sciences & Engineering", "Dentistry",  "Law", "Medicine", "Music", "Duke-NUS", "Yale-NUS", "University Scholars Programme", "Continuing and Lifelong Education"];
let facultiesArray = [];
   facultyNames.forEach((facultyName) => {
   facultiesArray.push({
          name: facultyName,
          moduleMappings: []
       });
   });

const SchoolSchema = new Schema({
   institution: String,
   world_rank: Number,
   national_rank: Number,
   description: String,
   location: String,
   sem_1: Number,
   sem_2: Number,
   any_sem: Number,
   faculties: {
        type: [facultySchema],
        default: facultiesArray
    },


});


module.exports = mongoose.model('School', SchoolSchema);