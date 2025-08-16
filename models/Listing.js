const mongoose=require("mongoose")
const Schema=mongoose.Schema
const Review=require("./review.js")
const User=require("./user.js")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        filename:String,
        url:{
            type:String,
            default:"https://www.favouritehomes.com/wp-content/uploads/2022/01/luxury-villa-life.jpg",
        }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String
    },
    country:{
        type:String,
        required:true
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    await Review.deleteMany({_id :{$in :listing.reviews}})
})
const listing=mongoose.model("listing",listingSchema)
module.exports=listing