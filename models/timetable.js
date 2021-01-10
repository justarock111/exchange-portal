var mongoose = require("mongoose");

var timetableScheme = new mongoose.Schema({
    classNo: String,
    startTime: String,
    endTime: String,
    weeks: [Number],
    venue: String,
    day: String,
    lessonType: String,
    size: Number
});

module.exports = mongoose.model("Timetable", timetableScheme);