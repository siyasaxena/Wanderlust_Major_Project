const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        next(new ExpressError(400,errmsg));
    }else{
        next();
    }
};

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
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})
//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","This listing doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));
//create route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    //let{title,description,price,location,country} = req.body;
    //let listing = req.body.listing;
    //let result = listingSchema.validate(req.body);
    //console.log(result);
    // if(result.error){
    //     throw new ExpressError(404,result.error);
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing registered");
    res.redirect("/listings");
    
}));

//edit
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(404,"Send valid data for listing");
    }
    let {id} = req.params;
    if (req.body.listing.image && req.body.listing.image.url === "") {
        req.body.listing.image.url = "https://plus.unsplash.com/premium_photo-1711305682256-3b1874c923bd?w=1000&auto=format&fit=crop&q=60";
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing is updated");
    res.redirect(`/listings/${id}`);
}))
//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}))

module.exports = router;