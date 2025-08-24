const express=require("express");
const router=express.Router();
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
router.route("/")
.get(wrapAsync(listingController.index))// index or home route
.post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));//post/create route to send created data in db from server form and then to show on home page by redirecting

//new route to create new listing
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route to show specific data
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))//update route
.delete( isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));//delete route

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;