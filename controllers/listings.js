const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAP_TOKEN;

module.exports.index = async (req, res) => {
  try {
    let { search, sort } = req.query; // दोनों query parameters को एक साथ निकाला
    let filterQuery = {}; // डिफ़ॉल्ट खाली ऑब्जेक्ट (यानी सब कुछ ढूंढो)
    let sortOption = {};

    // 1. Search Logic: सिर्फ फ़िल्टर ऑब्जेक्ट तैयार करें
    if (search && search.trim().length > 0) {
      filterQuery = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ],
      };
    }

    // 2. Sorting Logic: अगर यूजर ने High to Low या Low to High चुना है
    if (sort === "desc") {
      sortOption = { price: -1 }; // High to Low
    } else if (sort === "asc") {
      sortOption = { price: 1 }; // Low to High
    }

    console.log("Generated Filter Query:", JSON.stringify(filterQuery));
    // 3. Database Query: filterQuery और sortOption दोनों को एक साथ अप्लाई किया
    const allListings = await Listing.find(filterQuery).sort(sortOption);

    // 4. Render Response: डेटा को EJS पर भेजें
    res.render("listings/index.ejs", {
      allListings,
      currentSort: sort || "",
      currentSearch: search || "",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while fetching listings.");
    res.redirect("/");
  }
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listing.owner);
  if (!listing) {
    req.flash("error", "This listing doesn't exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res, next) => {
  //let{title,description,price,location,country} = req.body;
  //let listing = req.body.listing;
  //let result = listingSchema.validate(req.body);
  //console.log(result);
  // if(result.error){
  //     throw new ExpressError(404,result.error);
  // }
  const response = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    { limit: 1 },
  );
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url +"  " + filename);
  const newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };

  if (response.features && response.features.length > 0) {
    newListing.geometry = response.features[0].geometry;
  }

  await newListing.save();
  req.flash("success", "New listing registered");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    //throw new ExpressError(404, "Listing not found");
    req.flash("error", "Listing you requested for, doesn't exist....");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/h_300,w_250/e_blur:80",
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.body.listing.location) {
    const response = await maptilerClient.geocoding.forward(
      req.body.listing.location,
      { limit: 1 },
    );
    listing.geometry = response.features[0].geometry;
  }

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { filename, url };
  }

  await listing.save();

  req.flash("success", "Listing is updated");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
