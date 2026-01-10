import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js"
import {Kitten} from "../models/kitty.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const test= catchAsync(async(req, res)=>{
    throw new ApiError(400, "something went worng!!")
    res.send('test');
})
const test2=catchAsync(async(req, res)=>{
    const silence = new Kitten({ name: 'Silence' });
    const uploaded=await silence.save();
    if(!uploaded){
        throw new ApiError(400, "error uploading to db");
    }
    console.log(silence.name);
    return res.send(new ApiResponse(200, silence.name))
})

export {test, test2};