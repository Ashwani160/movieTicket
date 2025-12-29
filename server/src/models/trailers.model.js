import mongoose from "mongoose";

const TrailerSchema= new mongoose.Schema({
    image: String,
    videoUrl: String
})


export const Trailer=new mongoose.model('Trailer', TrailerSchema);