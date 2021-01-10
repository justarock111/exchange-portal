//REQUIRE MODULES
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");

const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);


var passport = require("passport");
var passportLocalMongoose = require("passport-local-mongoose");

var methodOverride = require("method-override");

//REQUIRE MODELS
var User = require("./models/user");
var School = require("./models/school");
var LocalModule = require("./models/localmodule");

//REQUIRE ROUTES
var indexRoutes = require("./routes/index");
var schoolRoutes = require("./routes/schools");
var moduleMappingRoutes = require("./routes/moduleMappings");
var additionalInformationRoutes = require("./routes/additionalInformation");

//MONGOOSE CONNECT & USE MODULES
var url = process.env.DB_URL || "mongodb://localhost:27017/NUSExchange";
mongoose.set('useFindAndModify', false);
mongoose.connect(url , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('Connected to DB @ ' + url))
.catch(error => console.log(error.message));

//SET STATIC RESOURCES
app.use( express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

const secret = process.env.SECRET || 'secretstring';
//PASSPORT CONNECT
const store = new MongoDBStore({
    url: url,
    secret,
    touchAfter: 24 * 3600
});

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24  * 7
    }
}

app.use(session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId, (err, user) => done(err, user));
});

const LocalStrategy = require("passport-local").Strategy;
const local = new LocalStrategy({
    passReqToCallback: true
    }, (req, username, password, done) => {
  User.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, req.flash('error', 'Invalid Username/Password'));
      } else {
        done(null, user, req.flash('success', 'Welcome ' + user.username));
      }
    })
    .catch(e => done(e));
});
passport.use("local", local);

//USE CONNECT-FLASH
app.use(flash());



//SET LOCALS
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//USE FILE UPLOAD MODULES
//app.use(fileUpload({
//    useTempFiles : true,
//    tempFileDir : "public/tmp/"
//}));
//app.use(cors());

//SET SALT AND HASH SETTINGS
const saltRounds = 10;



//ROUTES CONNECT
app.use("/", indexRoutes);
app.use("/schools", schoolRoutes);
app.use("/schools/:school_id", moduleMappingRoutes);
app.use("/schools/:school_id/additional_information", additionalInformationRoutes);


var port = process.env.PORT || 3000;
var ip = process.env.IP || '0.0.0.0';
console.log(ip);
console.log(port);
app.listen(port, ip, function(){
console.log("Server is running");
});
