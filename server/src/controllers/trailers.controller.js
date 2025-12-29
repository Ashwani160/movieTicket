import { Trailer } from "../models/trailers.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

const addTrailer=catchAsync(async(req, res)=>{
    const videos=req.body;
    if(!videos){
        throw new ApiError(401, "No input data provided");
    }
    const bulkOps=videos.map((video)=>{
        return {
            updateOne:{
                filter:{image:video.image},
                update:{ $set: video },
                upsert:true
            }
        }
    })
    const result=await Trailer.bulkWrite(bulkOps)

    if(!result.insertedCount && !result.modifiedCount && !result.upsertedCount && !result.matchedCount){
        console.log("error")
        throw new ApiError(401, "error uploading to db");
    }

    return res.status(200).send(new ApiResponse(200, "successfull"));
})

const allTrailers=catchAsync(async(req, res)=>{
    const videos=await Trailer.find().select('-_id');
    if(!videos){
        throw new ApiError(400, "No trailers found");
    }
    return res.status(200).send(new ApiResponse(200, videos));
})

export {
    addTrailer,
    allTrailers
}
 