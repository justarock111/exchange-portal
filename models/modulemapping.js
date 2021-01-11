var mongoose = require("mongoose");
var weightageSchema = require("./weightage").schema;
var contactHoursSchema = require("./contacthours").schema;

var moduleMappingSchema = new mongoose.Schema({
    moduleSubject: String,
    moduleNbr: String,
    moduleName: String,
    moduleCredit: Number,
    localModuleSubject: String,
    localModuleNbr: String,
    localModuleName: String,
    synopsis: String,
    weightage: weightageSchema,
     contactHours: contactHoursSchema,
    //TODO: SET DEFAULT
    instructionWeeks: Number,
    url: String,
    otherInformation: String,
    prerequisite: String,
    //TODO: Set default values
    year: Number,
    semester: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model( "ModuleMapping", moduleMappingSchema);