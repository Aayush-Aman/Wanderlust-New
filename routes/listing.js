const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAync")
const listing=require("../models/Listing")
const path=require("path")

// session middleware first


router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await listing.find({});
    res.render("./listings/index.ejs",{allListings})
}))

//route for creating a new listing 
router.get("/new",(req,res)=>{
    res.render("./listings/newlist.ejs");
})

router.post("/",wrapAsync(async(req,res,next)=>{
    
    const newlisting=new listing(req.body.listing);
    await newlisting.save();
    req.flash("success","new listing added successfully");
    res.redirect("/listings");
    
}))
//implementing the edit route 
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(id)
    const Listing=await listing.findById(id);
    if(!Listing){
        req.flash("error","the listing you are looking does not exist.")
         res.redirect("/listings")
         return;
    }
    res.render("./listings/edit.ejs",{Listing});
}))
//implementing the update route 
router.put("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    await listing.findByIdAndUpdate(id,{...req.body.Listing});
    req.flash("success","listing Edited successfully");
    res.redirect(`/listings/${id}`)
}))

//implementing show route for every single hotel
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listingdata=await listing.findById(id).populate("reviews");
    if(!listingdata){
        req.flash("error","the listing you are looking does not exist.")
         res.redirect("/listings")
         return;
    }
    res.render("./listings/showpersonal.ejs",{listingdata});
}))
//implementing the delete route 
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await listing.findByIdAndDelete(id);
    console.log(deletedlisting)
    req.flash("success","listing deleted successfully");

    res.redirect("/listings")
}))
module.exports=router;