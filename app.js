const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate = require('ejs-mate');
const path=require("path");
const methodOverride = require('method-override')
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const port=3000;
const MONGO_URL="mongodb://localhost:27017/wanderlust";
const Listing=require("./models/listing");
main()
.then(res=>console.log("connection success with db wanderlust"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("working");
})
// index or home route
app.get("/listings",async(req,res)=>{
    const allListing=await Listing.find();
    res.render("listings/index.ejs",{allListing});
})

//new route to create new listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})
//post/create route to send created data in db from server form and then to show on home page by redirecting
app.post("/listings",async(req,res)=>{
    // let {title,description,price,location ,country,image}=req.body;
    // let newListing=new Listing({
    //     title,
    //     description,
    //     price,
    //     location,
    //     country
    // })
    //method 2- listing object se name liye h uske andar object mein keys mein h saare already bas insert krdo vo object sidhe
    let newListing=new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
})
//show route to show specific data
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
// edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit",{listing})
})
//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})
app.listen(port,()=>{
    console.log(`connection successfully established at ${port}`);
})