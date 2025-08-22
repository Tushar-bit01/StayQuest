const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({
        username,
        email
    });
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("sucess","Welcome to StayQuest!");
    res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));

module.exports=router;