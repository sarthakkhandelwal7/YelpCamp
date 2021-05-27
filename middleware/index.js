var Comment = require("../models/comment");
var Campground = require("../models/campground");

middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(request, response, next) {
    if(request.isAuthenticated()){
        Campground.findById(request.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                request.flash("error", "Campground not found");
                response.redirect("back");
            } else {
                if(foundCampground.author.id.equals(request.user._id)){
                    next();
                } else {
                    request.flash("error", "You donot have the permission to do that");
                    response.redirect("back");
                }
            }
        });
    } else {
        request.flash("error", "You need to be legged in to do that");
        response.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(request, response, next){
    if(request.isAuthenticated()){
        Comment.findById(request.params.comment_id, function(err, foundComment){
            if(err){
                response.redirect("back");
            } else {
                if(foundComment.author.id.equals(request.user._id)){
                    next();
                } else {
                    request.flash("error", "You don't have the permission to do that");
                    response.redirect("back");
                }
            }
        });
    } else {
        request.flash("error", "You need to be legged in to do that");
        response.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    request.flash("error", "You need to be logged in to do that");
    response.redirect("/login");
}

module.exports = middlewareObj;