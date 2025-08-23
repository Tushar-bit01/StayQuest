module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","User must be logged in to access this Features!");
        return res.redirect("/login")
    }
    next();
}