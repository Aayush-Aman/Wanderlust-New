// implemnetation for database relationship showing one to few relationship

const {  mongoose } = require("mongoose");

const {Schema}=mongoose



async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relations");

}
main().then(()=>{
    console.log("connrction successful")
})
.catch((err)=>{
    console.log(err);
})
const userSchema=new Schema({
    username:String,
    address:[{
        location:String,
        city:String,
    }]
});
const user=mongoose.model("user",userSchema);

const addUser=async()=>{
let User=new user({
    username:"Aayush",
    address:[{
        location:"Bihar",
        city:"Patna",
    }]
})
User.address.push({location:"Delhi",city:"Jnaakpuri"})
User.address.push({location:"Kota",city:"Allen"})
let res=await User.save();
console.log(res);
}
addUser();