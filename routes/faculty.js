var mongoose = require("mongoose");
var moduleMappingSchema = require("./modulemapping").schema;

var facultySchema = new mongoose.Schema({
    name: String,
    moduleMappings: [moduleMappingSchema]
});


module.exports =  mongoose.model("Faculty", facultySchema);