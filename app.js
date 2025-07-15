const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=3000;
const MONGO_URL="mongodb://localhost:27017/wanderlust";
main()
.then(res=>console.log("connection success with db wanderlust"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("working");
})
app.listen(port,()=>{
    console.log(`connection successfully established at ${port}`);
})