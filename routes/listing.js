const express=require("express");
const router=express.Router();
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const {listingSchema,reviewSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join("");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

// index or home route
router.get("/",wrapAsync(async(req,res)=>{
    const allListing=await Listing.find();
    res.render("listings/index.ejs",{allListing});
}))

//new route to create new listing
router.get("/new",(req,res)=>{
    res.render("listings/new");
})
//post/create route to send created data in db from server form and then to show on home page by redirecting
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
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
    await newListing.save();
    res.redirect("/listings");
}))
//show route to show specific data
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}))
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    // console.log(listing);
    res.render("listings/edit",{listing});
}))
//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     // return next(new ExpressError(404,"Send Valid data for listing"));
    //     throw new ExpressError(400,"Send Valid data for listing");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))
//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

module.exports=router;