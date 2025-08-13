const express=require("express")
const app=express()
const router=express.Router()

router.get("/",(req,res)=>{
    res.send("at the user path ")
})
router.get("/new",(req,res)=>{
    res.send("New user path  ")
})
router.get("/:id",(req,res)=>{
    res.send("Show route for the user  ")
})

module.exports=router;