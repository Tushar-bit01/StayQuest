const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
    const allListing=await Listing.find();
    res.render("listings/index.ejs",{allListing});
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");
};
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you are trying to access does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
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
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
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
    // console.log(listing);
    res.render("listings/edit",{listing});
};
module.exports.updateListing=async(req,res)=>{
    // if(!req.body.listing){
    //     // return next(new ExpressError(404,"Send Valid data for listing"));
    //     throw new ExpressError(400,"Send Valid data for listing");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
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