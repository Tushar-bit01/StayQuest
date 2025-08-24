const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware");
const reviewController=require("../controllers/review.js");
//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;