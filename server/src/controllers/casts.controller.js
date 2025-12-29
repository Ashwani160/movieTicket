import mongoose from "mongoose";
import { Casts } from "../models/casts.model.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addCasts=catchAsync(async(req,res)=>{
    console.log(req.body);
    let uploaded;
    if (Array.isArray(req.body)) {
        uploaded = await Casts.insertMany(req.body);
        if (!uploaded || uploaded.length === 0) {
            throw new ApiError(400, "casts not uploaded");
        }
    }
    else {
        const casts = new Casts(req.body);
        uploaded = await casts.save();
        if (!uploaded) {
            throw new ApiError(400, "cast not uploaded");
        }
    }
    return res.send(new ApiResponse(200, uploaded));
})
export {addCasts};

// [
//     {
//     "name":"mewtwo",
//     "profile_path":"300 pc"
//     }, 
//     {
//     "name":"pikachu",
//     "profile_path":"300 pc"
//     }
// ]