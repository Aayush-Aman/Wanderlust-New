const mongoose=require("mongoose")
const {Schema}=mongoose

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/one_Many")
}
main().then(()=>{
    console.log("connection established with the mongodb ");
})
.catch((err)=>{
    console.log(err);
})
const orderSchema=new Schema({
    item:String,
    price:Number,
});
const order=mongoose.model("orders",orderSchema);
// const addOrder=async()=>{
//    let res= await order.insertMany([
//         {item:"keyboard",price:500},
//         {item:"mouse",price:200},
//         {item:"laptop",price:50000},
//     ]) 
//     console.log(res);
// }
// addOrder();
const customerSchema=new Schema({
    name:String,
    orders:[{
        type:Schema.Types.ObjectId,
        ref:"order",
    }]
})
customerSchema.pre("findOneAndDelete",async()=>{
    console.log("pre middleware ");
})
customerSchema.post("findOneAndDelete",()=>{
    console.log("post middleware detected ");
})




const customer=mongoose.model("customers",customerSchema);
const addCust=async()=>{
    let newCust=new customer({
        name:"Aayush Aman",
    })
    let neworder=new order({
        item:"pizza",
        price:250,
    });
    newCust.orders.push(neworder);
    await neworder.save();
    await newCust.save();
    console.log("added new customer ")
}
addCust();
const delCust=async()=>{
    let data=await customer.findByIdAndDelete("68932fdf8eb930b0e2abc544");
    console.log(data);
}
delCust();