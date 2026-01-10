import Booking from "../models/booking.model.js";
import Show from "../models/show.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

const isAdmin = catchAsync(async (req, res)=>{
    return res.json(new ApiResponse(200, {isAdmin: true}));
})

const getDashboardData= catchAsync(async(req, res)=>{
    const activeShows= await Show.find({showDateTime:{$gte: new Date()}}).populate('movie');
    const bookings= await Booking.find({isPaid: true});
    const totalUsers= await User.countDocuments();

    const totalRevenue= bookings.reduce((acc, bookings)=>{
        return acc+ bookings.amount;
    }, 0);

    const dashboardData={
        totalBookings: bookings.length,
        totalRevenue,
        totalUsers,
        activeShows
    }
    if(!dashboardData){
        throw new ApiError(404, "no data found");
    }
    return res.status(200)
         .json(new ApiResponse(200, {dashboardData}));

})

const getAllShows= catchAsync(async(req, res)=>{
    const allShows= await Show.find({$gte: new Date()}).populate('movie');
    return res.status(200)
        .json(new ApiResponse(200, {allShows}));
})

const getAllBookings=catchAsync(async(req, res)=>{
    const allBookings= await Booking.find({}).populate('user').populate({
    path: "show",
    populate: { path: "movie" }
    }).sort({createdAt:-1});

    return res.status(200)
        .json(new ApiResponse(200, {allBookings}))
})

export{
    isAdmin,
    getDashboardData,
    getAllShows,
    getAllBookings
}