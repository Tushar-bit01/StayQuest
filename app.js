const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=3000;
const MONGO_URL="mongodb://localhost:27017/wanderlust";
const Listing=require("./models/listing");
main()
.then(res=>console.log("connection success with db wanderlust"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("working");
})
app.get("/testlisting",async(req,res)=>{
    let newListing= new Listing({
        title:"villa",
        description:"biggest hotel of manali",
        price:15000,
        location:"manali",
        country:"india"
    })
    await newListing.save()
    .then(res=>console.log("new listing saved"))
    .catch(err=>console.log(err));
    res.send("working also");
})
app.listen(port,()=>{
    console.log(`connection successfully established at ${port}`);
})