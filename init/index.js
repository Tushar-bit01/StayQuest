if(process.env.NODE_ENV != "production"){
    require('dotenv').config({ path: '../.env' });
}
const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing");
const MONGO_URL="mongodb://localhost:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;
main()
.then(res=>console.log("connection build"))
.catch(err=>console.log(err));
async function main(){
    await mongoose.connect(dbUrl);
}
const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'68aef090969aba16bdde6575'}))
    await Listing.insertMany(initData.data);
}
initDB();