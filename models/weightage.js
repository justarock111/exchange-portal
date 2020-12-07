var mongoose = require("mongoose");

var weightageSchema = new mongoose.Schema({
    exam: Number,
    assignment: Number,
    quiz: Number,
    others: Number,
    remarks: String
});

module.exports = mongoose.model("Weightage", weightageSchema);