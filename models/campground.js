var mongoose = require("mongoose");

var CampSchema = new mongoose.Schema({
    name:String,
    price: {
        type: Number,
        default: 0.01
    },
    image: String,
    description: String,
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
        }],

    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
});

module.exports= mongoose.model("Campground", CampSchema);
