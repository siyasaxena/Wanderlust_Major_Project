const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

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

router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,validateListing,wrapAsync(ListingController.createListing ));

//index route
// router.get("/",wrapAsync(async (req,res)=>{
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }));
//router.get("/",wrapAsync(ListingController.index));

//new route
router.get("/new",isLoggedIn,ListingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(ListingController.showListings))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));
//show route
// router.get("/:id",wrapAsync(ListingController.showListings));
//create route
// router.post("/",isLoggedIn,validateListing,wrapAsync(ListingController.createListing ));

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));
//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(ListingController.updateListing));
//delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));

module.exports = router;