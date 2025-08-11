const mongoose=require("mongoose")
const initdata=require("./data")
const listing=require("../models/Listing")


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlustNew"
async function main(){
   await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("Connected to the db ")

}).catch(err=>{
    console.log(err)
})

const initDB= async()=>{
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data was initialised ")

}
initDB();