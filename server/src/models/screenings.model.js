import mongoose from "mongoose";

const ScreeningsSchema= new mongoose.Schema({
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },
    showDateTime: {
        type: Date,
        required: true
    },
    showPrice:{
        type: Number,
        required: true
    },
    occupiedSeats:{
        type: Object,
        default:{}
    }
},
    {
        timestamps: true,
        minimize: false
    }
)

export const Screeing = new mongoose.model('Screening', ScreeningsSchema);