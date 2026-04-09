const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate({path:"reviews", populate: {path: "author"}}).populate("owner");
    console.log(listing.owner);
    if(!listing){
        req.flash("error","This listing doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.createListing = async(req,res,next)=>{
    //let{title,description,price,location,country} = req.body;
    //let listing = req.body.listing;
    //let result = listingSchema.validate(req.body);
    //console.log(result);
    // if(result.error){
    //     throw new ExpressError(404,result.error);
    // }
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner =  req.user._id;
    await newListing.save();
    req.flash("success","New listing registered");
    res.redirect("/listings");
    
}
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs",{listing});
}
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing is updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing = async (req,res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}