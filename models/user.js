var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});


userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);