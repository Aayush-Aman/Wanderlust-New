const listing=require("./models/Listing")
const Review=require("./models/review")
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
module.exports.isOwner=async(req,res,next)=>{
     let {id}=req.params
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you do not have permission to do this action.")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you cannot delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}