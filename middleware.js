const Listing = require("./models/listing");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    //console.log(req.user);
    // console.log(req.path , "..", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged  in");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(404,"Send valid data for listing");
    }
    let {id} = req.params;
    if (req.body.listing.image && req.body.listing.image.url === "") {
        req.body.listing.image.url = "https://plus.unsplash.com/premium_photo-1711305682256-3b1874c923bd?w=1000&auto=format&fit=crop&q=60";
    }
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You can't edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        next(new ExpressError(400,errmsg));
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        next(new ExpressError(400,errmsg));
    }else{
        next();
    }
}