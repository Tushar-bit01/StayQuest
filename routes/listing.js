const express=require("express");
const router=express.Router();
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({  storage });
router.route("/")
.get(wrapAsync(listingController.index))// index or home route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));//post/create route to send created data in db from server form and then to show on home page by redirecting
//new route to create new listing
router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/filters/:filter",listingController.renderFiltersListing);
router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route to show specific data
.put(isLoggedIn,isOwner,isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))//update route
.delete( isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));//delete route

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;