module.exports.isLoggedin=(req,res,next)=>{
    if(!req.user){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must login first.")
         res.redirect("/user/login");
         return;
    }
    next();
}
module.exports.saveRedirectedUrl=(req,res,next)=>{
    if(req.session.redirect){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}