const express=require("express")
const app=express()
const session=require("express-session")
const user=require("./routes/user.js")
const post=require("./routes/post.js")
const cookieParser=require("cookie-parser")
// app.use(cookieParser())
app.use(cookieParser("mysecretkey"))
const sessionOptions={secret:"mySecretString",resave:false,saveUninitialized:true}

app.use(session(sessionOptions));

app.get("/register",(req,res)=>{
    let {name="Anonymous"}=req.query;
    res.send(name);
})


app.get('/',(req,res)=>{
    console.dir(req.cookies)
    res.send("Hii i'm root .")
})
//tracking the no of times the request has come 
app.get("/reqcount",(req,res)=>{
    if(req.session.count)req.session.count++;
    else req.session.count=1
    
    res.send(`you sent the request for ${req.session.count} times`);
})
app.get("/test",(req,res)=>{
    res.send("test successful")
})
// //making some routes for the user 
// app.use("/user",user);
// //creating some routes for the post 
// app.use("/post",post);

// app.get("/getcookies",(req,res)=>{
//     res.cookie("Name","Aman")
//     res.cookie("Country","India")
//     res.send("sent some cookies")
// })
// app.get("/greet",(req,res)=>{
//     let {Name="anonymous"}=req.cookies;
//     res.send(`Hii Mr ${Name}`);
// })
// app.get("/getSignedCookie",(req,res)=>{
//     res.cookie("love","coding",{signed:true})
//     res.send("signed cookie sent ");
// })
// app.get("/verifySignedCookie",(req,res)=>{
//     console.log(req.signedCookies)
//     res.send("Signed cookies printed in terminal ")
// })

app.listen(8080,(req,res)=>{
    console.log("listening to the port 8080")
})