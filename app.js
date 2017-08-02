var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var flash         = require("connect-flash");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy  =  require('passport-google-oauth').OAuth2Strategy;
var Book          = require("./models/book");
var seedDB        = require("./seeds.js"); // in lecture it is ".seed" only and it's not working here
var Comment       = require("./models/comment");
var User          = require("./models/user.js");
var methodOverride= require("method-override");

var configAuth = require('./config/auth');
var commentRoutes = require("./routes/comments");
var booksRoutes   = require("./routes/books");
var indexRoutes   = require("./routes/index");
var contactRoutes = require('./routes/contact.js');



//--------------------------------------------------------------------------------------------------------------------------
var DBURL = process.env.url;

if(!DBURL)
    {
        DBURL= "mongodb://localhost/startup_final" ;
    }

 mongoose.connect(DBURL);

//-------------------------------------



app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs"); 


app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//--------------------------------------------------------------------------------------------------------------------------

// seedDB(); // seed the database

// PASSPORT CONFIGURATION

app.use(require("express-session")({
       
       secret:          "irodov",
       resave:           false,
       saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());

//LocalStrategy

//    passport.use(new LocalStrategy({   // 'login-signup' is optional here   
//    usernameField : 'username',
//    passwordField : 'password',        
//    passReqToCallback : true },function(req, username, password, done) {
//   var email = req.body.email;
//  var username = req.body.username;
////  var gender = req.body.gender;
//        
//        }));
passport.use(new LocalStrategy(User.authenticate()));

//==============================================
// Facebook Strategy
//===============================================
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name']
  },
                                  
                                  
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function()
    {
    User.findOne({'facebook.id':profile.id}, function(err,user)
    {
    
    if(err)
        return done(err);
    if(user){
        
        return done(null,user);
     
    } else {
        
        var newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.token = accessToken;
        newUser.facebook.name= profile.name.givenName + ' '+profile.name.familyName;
        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
        
            newUser.save(function(err)
            {
            
            if(err)
                throw err;
            return done(null, newUser);
            }
                        
            );
    }
    
    }
                
    );
    
    }
                    
                    
    );
  }
));
//-------------------------------

//========================================
//    Google Strategy
//=======================================


passport.use(new GoogleStrategy({  
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({ 'google.id': profile.id }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));






//------------------------------------------

// serialize/deserialize

 passport.serializeUser(function(user, done) {
        done(null, user.id);
     
 });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

 
app.use(function(req, res, next){
   res.locals.currentUser    = req.user;
   res.locals.error          = req.flash("error");
   res.locals.success        = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/books",booksRoutes);
app.use("/books/:id/comments",commentRoutes);
app.use(contactRoutes);



app.listen(process.env.PORT||3000,process.env.IP, function(){
  
  console.log("SERVER IS STARTED");

});

  ////////////////////////////////////////
 ///       [campgrounds=books]        ///
////////////////////////////////////////


  ////////////////////////////////////////
 ///       [newCampground = newBooks] ///      
////////////////////////////////////////


  /////////////////////////////////////////////
 ///       [campgroundSchema = bookSchema] ///      
/////////////////////////////////////////////
