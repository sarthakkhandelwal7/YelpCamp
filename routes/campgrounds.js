var express = require("express");
var router  = express.Router(); 
var Campground = require("../models/campground");
var middlewareObj = require("../middleware/index");


router.get('/', function(request, response){
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err);
        } else {
            response.render("campgrounds/index", {campgrounds:campgrounds, currentUser: request.user});
        }
    });
    
});

router.post("/", middlewareObj.isLoggedIn, (request, response) => {
    var name = request.body.name;
    var price = request.body.price;
    var image = request.body.image;
    var desc = request.body.description;
    var author = {
        id: request.user._id,
        username: request.user.username
    }
    var newCampground = {name: name, price:price, image:image, description: desc, author: author}

    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            response.redirect("/campgrounds");
        }
    });
});

router.get('/new', middlewareObj.isLoggedIn, function(request, response){
    response.render("campgrounds/new");
});

router.get("/:id", (request, response) => {
    Campground.findById(request.params.id).populate("comments").exec((err, foundCampground) => {
        if(err || !foundCampground){
            request.flash("error", "Campground not found");
            response.redirect("back");
        } else {
            response.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(request ,response){
    Campground.findById(request.params.id, function(err, foundCampground){
        response.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(request, response){
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(err, updatedCampground){
        if(err){
            response.redirect("/campgrounds");
        } else {
            response.redirect("/campgrounds/" + request.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(request, response){
    Campground.findByIdAndRemove(request.params.id, function(err){
        response.redirect("/campgrounds");
    });
});

module.exports = router;