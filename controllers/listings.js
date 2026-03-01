const Listing = require("../models/listing");

//Index Route
module.exports.index =  async (req , res) =>  {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

//New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//Search Bar
module.exports.searchListing = async(req, res) => {
    let { q } = req.query;
    if(!q) {
        req.flash("error", `Please enter something to search`);
        return res.redirect("/listings");
    }
    const searchedListings = await Listing.find({
    title: { $regex: q, $options: "i" }
    })

    if(searchedListings.length === 0) {
        req.flash("error", `No such listing founded`);
        return res.redirect("/listings");
    } else {
        res.render("listings/index2.ejs", {searchedListings});
    }  
};

//Create Route
module.exports.createListing = async(req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
};

//Show Route
module.exports.showListing = async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate : {path : "author"}}).populate("owner");
    
    if(!listing) {
        req.flash("error", "Listing you requsted for does not exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", {listing});
    }  
};

//Edit Route
module.exports.editListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requsted for does not exist");
        res.redirect("/listings");
    } else {
        let originalUrl = listing.image.url; 
        originalUrl = originalUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", {listing, originalUrl})
    }
};

//Update Route
module.exports.updateListing = async (req, res) => {

    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data for Listing");
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    

    if(typeof(req.file) !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
};

//Destroy Route
module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    let deletedChat = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    
    res.redirect("/listings");
}