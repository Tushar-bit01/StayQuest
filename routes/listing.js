const express=require("express");
const router=express.Router();
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
// index or home route
router.get("/",wrapAsync(listingController.index));

//new route to create new listing
router.get("/new",isLoggedIn,listingController.renderNewForm)
//post/create route to send created data in db from server form and then to show on home page by redirecting
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));
//show route to show specific data
router.get("/:id",wrapAsync(listingController.showListing));
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));
//delete route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports=router;