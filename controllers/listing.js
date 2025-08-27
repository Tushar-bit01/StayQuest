const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
    const allListing=await Listing.find();
    res.render("listings/index.ejs",{allListing});
};
module.exports.renderFiltersListing=async (req,res)=>{
    let {filter}=req.params;
    const filteredListing = await Listing.find({ categories: { $in: [filter] } });
    // console.log(filteredListing);
    res.render("listings/filter",{filteredListing,filter});
}
module.exports.renderSearchResults=async (req,res)=>{
    let searchQuery = req.query.q; // yahan se mila "Delhi"

    let listings = await Listing.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { country: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } }
      ]
    });
  
    res.render("listings/search", { listings, searchQuery });
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");
};
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you are trying to access does not exist!");
        return res.redirect("/listings");
    }

    // ✅ Geocoding (Nominatim API se)
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${listing.location}`,
            {
                headers: { "User-Agent": "wanderlust-app" } // nominatim ke liye zaroori
            }
        );
        const data = await response.json();
        console.log(data);
        if (data.length > 0) {
            listing.lat = data[0].lat;
            listing.lon = data[0].lon;
        }
    } catch (err) {
        console.error("Geocoding error:", err);
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing=async(req,res,next)=>{
    // let {title,description,price,location ,country,image}=req.body;
    // let newListing=new Listing({
    //     title,
    //     description,
    //     price,
    //     location,
    //     country
    // })
    //method 2- listing object se name liye h uske andar object mein keys mein h saare already bas insert krdo vo object sidhe
    // if(!req.body.listing){
    //     return next(new ExpressError(400,"Send Valid data for listing"));
    //     // throw new ExpressError("Send Valid data for listing");
    // }
    // let result=listingSchema.validate(req.body);
    // if(result.error){
    //     return next(new ExpressError(400,result.error));
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url ,"..",filename);
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("sucess","New Listing Created!");
    res.redirect("/listings");
};
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are trying to edit does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250"); 
    // console.log(listing);
    res.render("listings/edit",{listing,originalImageUrl});
};
module.exports.updateListing=async(req,res)=>{
    // if(!req.body.listing){
    //     // return next(new ExpressError(404,"Send Valid data for listing"));
    //     throw new ExpressError(400,"Send Valid data for listing");
    // }
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("sucess","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted!");
    console.log(deleteListing);
    res.redirect("/listings");
};