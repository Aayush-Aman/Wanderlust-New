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
const listingroutes=require("./routes/listing")
const userroutes=require("./routes/user")
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
const User=require("./models/user.js")
const{isLoggedin}=require("./middleware.js")


app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate)
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")))


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

const sessionOptions={
    secret:"mysupersecretkey",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash())

//middlewares for the passport 
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

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

app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"aman@gmal.com",
        username:"delta-student",
    })
    let registerduser=await User.register(fakeUser,"helloworld");
    res.send(registerduser);
})
app.get('/',(req,res)=>{
    res.send("i am root ")
})
app.use("/listings",listingroutes)
app.use("/user",userroutes)

//implementing the review route 
app.post("/listings/:id/reviews",isLoggedin,validateReview,async(req,res)=>{
    let {id}=req.params;
    let list=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log("save ho rha hai ");
    res.redirect(`/listings/${id}`);


})


//delete review route 
app.delete("/listings/:id/reviews/:reviewId",isLoggedin,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went wrong "} = err
    res.render("./listings/error.ejs",{err})
    // res.status(statuscode).send(message)
})


app.listen(8080,(req,res)=>{
    console.log("app started to port no 8080");
})