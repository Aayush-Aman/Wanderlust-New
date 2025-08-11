const express=require("express")
const app=express()
const mongoose=require("mongoose")
const listing=require("./models/Listing")
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAync")
const ExpressError=require("./utils/ExpressError")
const Review=require("./models/review")
const {reviewSchema}=require("./models/schema")

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate)
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")))


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
//connecting the mongoose 
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlustNew"
async function main(){
   await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("Connected to the db ")

}).catch(err=>{
    console.log(err)
})

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


app.get('/',(req,res)=>{
    res.send("i am root ")
})
// app.get('/listings',async(req,res)=>{
//     let sampletesting=new listing({
//         title:"My villa",
//         description:"This is my personal villa",
//         price:1500,
//         location:"Goa ",
//         country:"India"
//     })
//     await sampletesting.save();
//     console.log("sample testing was saved ")
//     res.send("successful tesing")
// })

//now creating the index route 

/*app.get("/listings",(req,res)=>{
    listing.find({}).then(res=>{
        console.log(res);
    })
})
*///its a way ki jo v find se respnse aya hai usko console kar do 

app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await listing.find({});
    res.render("./listings/index.ejs",{allListings})
}))

//route for creating a new listing 
app.get("/listings/new",(req,res)=>{
    res.render("./listings/newlist.ejs");
})

app.post("/listings",wrapAsync(async(req,res,next)=>{
    
    const newlisting=new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
    
}))
//implementing the edit route 
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(id)
    const Listing=await listing.findById(id);
    res.render("./listings/edit.ejs",{Listing});
}))
//implementing the update route 
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params
    await listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`)
}))

//implementing show route for every single hotel
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listingdata=await listing.findById(id).populate("reviews");

    res.render("./listings/showpersonal.ejs",{listingdata});
}))
//implementing the review route 
app.post("/listings/:id/reviews",validateReview,async(req,res)=>{
    let {id}=req.params;
    let list=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log("save ho rha hai ");
    res.redirect(`/listings/${id}`);


})

//implementing the delete route 
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await listing.findByIdAndDelete(id);
    console.log(deletedlisting)
    res.redirect("/listings")
}))
//delete review route 
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

// app.get("/*",(req,res,next)=>{
//     next(new ExpressError(404,"msg not found"))
// })

app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went wrong "} = err
    res.render("./listings/error.ejs",{err})
    // res.status(statuscode).send(message)
})




app.listen(8080,(req,res)=>{
    console.log("app started to port no 8080");
})