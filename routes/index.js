var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");
var client     = require('twilio')('ACa51208a494fa6858d2aa458e6393d2bd','3c79701ca13405a3cff0dadba4d4e48c');


//landing page
router.get("/",function(req, res){   

 res.render("landing");
});





//================
//   AUTH ROUTES
//================

// show register form

router.get("/register", function(req, res){
    
    res.render("register");

});

// handle signup logic
var email;
var gender;
router.post("/register", function(req, res){
         
       
       var newUser = new User({username: req.body.username});
      email = req.body.email;
      gender = req.body.email;

       User.register(newUser, req.body.password, function(err, user){
            if(err) {
              console.log(err); 
              
              req.flash("error", err.message);
              return res.render("register");
            }

        passport.authenticate("local")(req, res, function(){
        
          req.flash("success", "welcome to yehBOok " + user.username);
      
          res.redirect("/");
        });


      });

});


//show login form

router.get("/login", function(req, res){
    res.render("login");
}); 

// handling login logic
router.post("/login", passport.authenticate("local",
 {
  successRedirect: "/books",
  failureRedirect: "/login"

}), function(req, res){


});

//==========================
//  Facebook Routes
//==========================

router.get("/auth/facebook",passport.authenticate('facebook', {scope:'email'}));

router.get("/auth/facebook/callback",passport.authenticate('facebook',{
    
    successRedirect: '/',
    failureRedirect:'/login',
    
}));


//------------------------------

//===================================
//  Google Routes
//==================================
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {  
  successRedirect: '/',
  failureRedirect: '/login'
}));

//---------------------------------------

// logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!!");
  res.redirect("/");
});



function isLoggedIn(req, res, next)
{
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}



module.exports  =  router;


