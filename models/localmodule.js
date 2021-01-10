var mongoose = require("mongoose");
var semesterSchema = require("./semester").schema;

var localModuleSchema = new mongoose.Schema({

            acadYear: String,
            preclusion: String,
            description: String,
            title: String,
            department: String,
            faculty: String,
            workload: [Number],
            prerequisite: String,
            moduleCredit: Number,
            moduleCode: String,
            attributes: {
                su: Boolean
            },
            alias: [String],
            semesterData: [semesterSchema],
            prereqTree: {type: mongoose.Schema.Types.Mixed},
            fulfillRequirements: [String]

});
module.exports = mongoose.model("LocalModule", localModuleSchema);