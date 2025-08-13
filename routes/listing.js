const express=require("express");
const app=express();
const router=express.Router();
const wrapAsync=require("../utils/wrapAync")
const mongoose=require("mongoose")
const listing=require("../models/Listing")
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const ExpressError=require("../utils/ExpressError")
const Review=require("../models/review")
const {reviewSchema}=require("../models/schema")
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate)
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")))


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

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
    res.redirect("/listings");
    
}))
//implementing the edit route 
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(id)
    const Listing=await listing.findById(id);
    res.render("./listings/edit.ejs",{Listing});
}))
//implementing the update route 
router.put("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    await listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`)
}))

//implementing show route for every single hotel
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listingdata=await listing.findById(id).populate("reviews");

    res.render("./listings/showpersonal.ejs",{listingdata});
}))
//implementing the delete route 
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await listing.findByIdAndDelete(id);
    console.log(deletedlisting)
    res.redirect("/listings")
}))
module.exports=router;