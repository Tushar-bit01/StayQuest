const User=require("../models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
};

module.exports.signup=async (req,res)=>{
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
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login");
};

module.exports.login=async (req,res)=>{
    req.flash("sucess","Welcome back to StayQuest!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
        return next(err);
       } 
       req.flash("sucess","You are logged out!");
       res.redirect("/listings");
    })
};