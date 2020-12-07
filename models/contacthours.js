var mongoose = require("mongoose");

var contactHoursSchema = new mongoose.Schema({
    lecture: Number,
    tutorials: Number,
    practicals: Number,
    others: Number,
    remarks: String
});

module.exports = mongoose.model("ContactHours", contactHoursSchema);