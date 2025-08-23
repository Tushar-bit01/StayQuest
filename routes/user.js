const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

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
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("sucess","Welcome to StayQuest!");
        res.redirect("/listings");
    })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async (req,res)=>{
    req.flash("sucess","Welcome back to StayQuest!");
    res.redirect(req.session.redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
       if(err){
        return next(err);
       } 
       req.flash("sucess","You are logged out!");
       res.redirect("/listings");
    })
})

module.exports=router;