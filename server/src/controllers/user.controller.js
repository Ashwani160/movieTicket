import Booking from "../models/booking.model.js";
import Movie from "../models/movie.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import {clerkClient} from "@clerk/express";

const getUserBookings= catchAsync(async(req, res)=>{
    const userId= req.auth()?.userId;
    if(!userId){
        throw new ApiError(400, "no user found");
    }
    console.log(userId);

    const bookings= await Booking.find({user: userId}).populate({
        path: "show",
        populate:{path:"movie"}
    });
    return res.status(200)
        .json(new ApiResponse(200, bookings, "bookings fetched successfully"));
})

const updateFavorite= catchAsync(async(req , res)=>{
    const {movieId}=req.body;
    const userId= req.auth()?.userId;
    
    if(!movieId){
        throw new ApiError(400, "movieId is required");
    }
    if(!userId){
        throw new ApiError(401, "Unauthorized");
    }
    const user= await clerkClient.users.getUser(userId);



    if(!user.privateMetadata.favorites){
        user.privateMetadata.favorites=[];
    }

    if(!user.privateMetadata.favorites.includes(movieId)){
        user.privateMetadata.favorites.push(movieId);
    } else{
        user.privateMetadata.favorites=user.privateMetadata.favorites.filter(id=> id!==movieId);
    }

    await clerkClient.users.updateUser(userId,{
        privateMetadata:{
            favorites: user.privateMetadata.favorites
        }
    })

    return res.status(200)
        .json(new ApiResponse(200, user.privateMetadata.favorites, "Favorite updated successfully"));

})

const getFavorites= catchAsync(async(req, res)=>{
    const userId= req.auth().userId;
    if(!userId){
        throw new ApiError(401, "Unauthorized");
    }
    const user= await clerkClient.users.getUser(userId);
    const favorites= user.privateMetadata.favorites || [];

    const movieData= await Movie.find({_id: {$in: favorites}});

    return res.status(200)
        .json(new ApiResponse(200, movieData, "favorite movies fetched successfully"));
})


export {
    getUserBookings,
    updateFavorite,
    getFavorites
}