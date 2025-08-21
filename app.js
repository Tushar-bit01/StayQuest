const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate = require('ejs-mate');
const path=require("path");
const methodOverride = require('method-override')
const ExpressError=require("./utils/ExpressError");
const session=require('express-session');
const flash=require('connect-flash');
const sessionOptions={
    secret:"mysecretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const port=3000;
const MONGO_URL="mongodb://localhost:27017/wanderlust";
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
main()
.then(res=>console.log("connection success with db wanderlust"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("working");
})
app.use((req,res,next)=>{
    res.locals.success=req.flash("sucess");
    res.locals.error=req.flash("error");
    next();
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
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