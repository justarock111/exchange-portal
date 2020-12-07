var mongoose = require("mongoose");

var linkSchema = new mongoose.Schema({
                title: String,
                description: String,
                url: String,
                author: {
                id: {
                   type: mongoose.Schema.Types.ObjectId,
                   ref: "User"
                },
                username: String
                }
});

module.exports = mongoose.model("Link", linkSchema);