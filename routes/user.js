const express=require("express")
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAync");
const passport = require("passport");
const{isLoggedin}=require("../middleware")
const {saveRedirectedUrl}=require("../middleware")

//code for the signup 
router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res)=>{
    let{email,username,password}=req.body;
    const newuser=new User({email,username});
    let registerduser=await User.register(newuser,password);
    
    console.log(registerduser);
    req.login(registerduser,(err)=>{
        if(err)return next(err);
        req.flash("success","welcome ")
        res.redirect("/listings")
    })
}))

//code for logging in 
router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})
router.post("/login",
    saveRedirectedUrl,
    passport.authenticate("local",{failureRedirect:'/user/login',failureFlash:true})  
    ,(req,res)=>{
    req.flash("success","You are logged in ");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
})

//code for loggin out
router.get("/logout",isLoggedin,(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out !!")
        res.redirect("/listings")
    })
})


module.exports=router;