const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate = require('ejs-mate');
const path=require("path");
const methodOverride = require('method-override')
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema,reviewSchema}=require("./schema.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const port=3000;
const MONGO_URL="mongodb://localhost:27017/wanderlust";
const Listing=require("./models/listing");
const Review=require("./models/review.js");
const listings=require("./routes/listing.js");
main()
.then(res=>console.log("connection success with db wanderlust"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL);
}
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join("");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join("");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
app.get("/",(req,res)=>{
    res.send("working");
})
app.use("/listings",listings);
//reviews
//post route
app.post("/listings/:id/reviews",validateReview,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    
    await listing.save();
    
    res.render("feedbackthnx.ejs",{id});
}));
//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))
app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="some error occured"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})
app.listen(port,()=>{
    console.log(`connection successfully established at ${port}`);
})