import mongoose from "mongoose";


export const mongodbConnet= async ()=>{
    await mongoose.connect('mongodb://localhost:27017/chatApp',{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    console.log("mongo db is connected");
    
}
