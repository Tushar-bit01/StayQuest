module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error","User must be logged in to access this Features!");
        return res.redirect("/login")
    }
    next();
}