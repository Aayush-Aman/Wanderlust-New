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
const customer=mongoose.model("customers",customerSchema);
const addCustomer=async()=>{
    let customer1=new customer({
        name:"Aayush",
    });
    let order1=await order.findOne({item:"keyboard"});
    let order2=await order.findOne({item:"mouse"});
    customer1.orders.push(order1);
    customer1.orders.push(order2);
    let res=await customer1.save();
    console.log(res);

}
addCustomer();