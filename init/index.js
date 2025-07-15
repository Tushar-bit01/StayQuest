const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing");
const MONGO_URL="mongodb://localhost:27017/wanderlust";
main()
.then(res=>console.log("connection build"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect(MONGO_URL)
}
const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
}
initDB();