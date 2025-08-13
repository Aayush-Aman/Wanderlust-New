const express=require("express")
const app=express();
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Welcome to post route ")
})
router.get("/new",(req,res)=>{
    res.send("create new post route  ")
})
router.get("/:id",(req,res)=>{
    res.send("showing id for the post route   ")
})
module.exports=router;