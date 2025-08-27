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
module.exports.profile=async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let userData=await User.findById(id);
    console.log(userData);
    if(userData){
        res.render("users/profile",{userData});
    }else{
        res.render("error","Login to access this feature");
    }
    
}
module.exports.profileEditRender=async(req,res)=>{
    let {id}=req.params;
    let userData=await User.findById(id);
    if(userData){
        res.render("users/edit",{userData});
    }else{
        req.flash("error","Login to access this feature");
        res.redirect("/listings");
    }
};
module.exports.editProfile=async(req,res)=>{
    let {id}=req.params;
    let user=await User.findByIdAndUpdate(id,{...req.body.user});
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
    user.pfp={url,filename};
    await user.save();
    }
    req.flash("sucess","Profile Updated Successfully!");
    res.redirect(`/profile/${id}`);
}