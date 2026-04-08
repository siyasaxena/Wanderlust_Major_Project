const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description:"By the beach",
//         price: 1200,
//         location:"Calangute, Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });
//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})
//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate("owner");
    console.log(listing.owner)
    if(!listing){
        req.flash("error","This listing doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));
//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
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
    
}));

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing is updated");
    res.redirect(`/listings/${id}`);
}))
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}))

module.exports = router;