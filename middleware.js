const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

//Checks if the user if Logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //Redirect URL save
        req.session.redirectUrl = req.originalUrl;
        console.log(req.path, "..", req.originalUrl);
        req.flash("error", "You must be logged in to create listing.");
        return res.redirect("/login");
    }
    next();
}


//Redirect after signup
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};


//Owner of listing or not verification
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


//Listings Joi Validation
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Review Joi Validation
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => error.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Author of review or not verification
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    console.log( reviewId);
    // console.log("reviewId:", reviewId);
    let review = await Review.findById(reviewId);
    console.log(review);
    
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}