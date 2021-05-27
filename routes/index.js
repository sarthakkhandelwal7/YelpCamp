var express = require("express");
var router  = express.Router(); 
var passport = require("passport");
var User = require("../models/user");

router.get('/', function(request, response){
    response.render("landing");
});



router.get("/register", function(request, response){
    response.render("register");
});

router.post("/register", function(request, response){
    var newUser = new User({username: request.body.username});
    User.register(newUser, request.body.password, function(err, user){
        if(err){
            request.flash("error", err.message);
            return response.render("register");
        }
    //  |  This is like a function   |
        passport.authenticate("local")(request, response, function(){
            request.flash("success", "Welcome to YelpCamp " + user.username);
            response.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(request, response){
    response.render('login');
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
function(request, response){

});

router.get("/logout", function(request, response){
    request.logout();
    request.flash("success", "You are logged out");
    response.redirect("/campgrounds");
});

function isLoggedIn(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect("/login");
}

module.exports = router;