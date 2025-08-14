const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate = require('ejs-mate');
const path=require("path");
const methodOverride = require('method-override')
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema.js");
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
app.get("/",(req,res)=>{
    res.send("working");
})
// index or home route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListing=await Listing.find();
    res.render("listings/index.ejs",{allListing});
}))

//new route to create new listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})
//post/create route to send created data in db from server form and then to show on home page by redirecting
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
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
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))
// edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    // console.log(listing);
    res.render("listings/edit",{listing})
}))
//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
    //     // return next(new ExpressError(404,"Send Valid data for listing"));
    //     throw new ExpressError(400,"Send Valid data for listing");
    // }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}))
//reviews
//post route
app.post("/listings/:id/reviews", async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    
    await listing.save();
    
    res.render("feedbackthnx.ejs",{id});
});
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