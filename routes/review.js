const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing");
const {validateReview}=require("../middleware");
//reviews
//post route
router.post("/",validateReview,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    
    await listing.save();
    res.render("feedbackthnx.ejs",{id});
}));
//delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review Deleted!");
    res.redirect(`/listings/${id}`);
}))
module.exports=router;