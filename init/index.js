const mongoose=require("mongoose")
const initdata=require("./data")
const listing=require("../models/Listing")
const User=require("../models/user")


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
     const modifiedData = initdata.data.map(obj => ({
        ...obj,
        owner: "689fc2e2b45fc32ccf149a6f"
    }));
    await listing.insertMany(modifiedData);
    console.log("data was initialised ")

}
initDB();