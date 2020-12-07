//REQUIRE MODULES
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");

var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var methodOverride = require("method-override");



var fileUpload = require('express-fileupload');
var cors = require('cors');

//REQUIRE MODELS
var Comment = require("./models/comment");
var User = require("./models/user");
var School = require("./models/school");

//REQUIRE ROUTES
var indexRoutes = require("./routes/index");
var schoolRoutes = require("./routes/schools");
var moduleMappingRoutes = require("./routes/moduleMappings");
var commentRoutes = require("./routes/comments");
var additionalInformationRoutes = require("./routes/additionalInformation");

//MONGOOSE CONNECT & USE MODULES
var url = process.env.DATABASEURL || "mongodb://localhost:27017/NUSExchange";
console.log(url);
mongoose.set('useFindAndModify', false);
mongoose.connect(url , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//SET STATIC RESOURCES
app.use( express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//PASSPORT CONNECT
app.use(require("express-session")({
    secret: "Secret string",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//USE CONNECT-FLASH
app.use(flash());



//SET LOCALS
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//USE FILE UPLOAD MODULES
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "public/tmp/"
}));
app.use(cors());

//ROUTES CONNECT
app.use("/", indexRoutes);
app.use("/schools", schoolRoutes);
app.use("/schools/:school_id/comments", commentRoutes);
app.use("/schools/:school_id", moduleMappingRoutes);
app.use("/schools/:school_id/additional_information", additionalInformationRoutes);


var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
console.log(ip);
console.log(port);
app.listen(port, ip, function(){
console.log("Server is running");
});