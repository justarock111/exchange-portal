var mongoose = require("mongoose");
var timetableSchema = require("./timetable").schema;

var semesterSchema = new mongoose.Schema({
    semester: Number,
    timetable: [timetableSchema],
    examDate: String,
    examDuration: Number
});

module.exports = mongoose.model("Semester", semesterSchema);