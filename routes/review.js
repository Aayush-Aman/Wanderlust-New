const express=require("express")
const router=express.Router({mergeParams:true});
const{isLoggedin}=require("../middleware")
const wrapAsync=require("../utils/wrapAync")
const Review =require("../models/review")
const listing=require("../models/Listing")
const {reviewSchema}=require("../models/schema")
const {isReviewAuthor}=require("../middleware")

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((er)=>er.message).join(",")
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }

}

//implementing the review route 
router.post("",isLoggedin,validateReview,async(req,res)=>{
    let {id}=req.params;
    let list=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log(newReview);
    res.redirect(`/listings/${id}`);


})


//delete review route 
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports=router;