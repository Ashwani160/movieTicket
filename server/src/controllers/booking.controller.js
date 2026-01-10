import Booking from "../models/booking.model.js";
import Show from "../models/show.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

//Function to check availability of selected seats for a movie
const checkSeatAvailability = async (showId, selectedSeats) => {
    const show = await Show.findById(showId);
    if (!show) {
        throw new ApiError(404, "Show not found");
    }

    const occupiedSeats = show.occupiedSeats || {};

    const isAnySeatTaken = selectedSeats.some(
        seat => occupiedSeats[seat]
    );

    return !isAnySeatTaken;
};

const createBooking= catchAsync(async(req, res)=>{

    console.log(req.auth())   
    const {showId, selectedSeats}= req.body;
    const {userId}= req.auth();
    const {origin}= req.headers;
    console.log(userId)

    const isAvailable= await checkSeatAvailability(showId, selectedSeats);
    if(!isAvailable){
        throw new ApiError(400, "Selected seats are already booked");
    }

    const show= await Show.findById(showId).populate('movie');

    const booking= await Booking.create({
        show:showId,
        user:userId,
        amount: show.showPrice * selectedSeats.length,
        bookedSeats: selectedSeats
    })

    selectedSeats.map((seat)=>{
        show.occupiedSeats[seat]=userId;
    })
    show.markModified('occupiedSeats');
    await show.save();

    return res.status(201)
       .json(new ApiResponse(201, {booking}));
    


}) 

const getOccupiedSeats= catchAsync(async(req, res)=>{
    const {showId}= req.params;
    const show= await Show.findById(showId);
    if(!show){
        throw new ApiError(404, "Show not found");
    }
    const occupiedSeats= Object.keys(show.occupiedSeats || {});
    return res.status(200)
         .json(new ApiResponse(200, {occupiedSeats}));
})

export {
    createBooking,
    getOccupiedSeats
}