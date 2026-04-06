const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



const validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        next(new ExpressError(400,errmsg));
    }else{
        next();
    }
}

//reviews 
// post review route
router.post("/",validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","New review registered");
    res.redirect(`/listings/${listing._id}`);
}));
//delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review deleting");
    res.redirect(`/listings/${id}`);   
}))


module.exports = router;