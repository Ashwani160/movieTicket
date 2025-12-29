import mongoose from "mongoose";

const ShowsSchema = new mongoose.Schema({
    id: { 
        type: Number,
        required: true,
        unique: true 
    },
    title: {
        type: String,
        required: true
    },
    overview: String,
    poster_path: String,
    backdrop_path: String,

    // Stores genres exactly as-is: [ { id: 123, name: "Action" } ]
    genres: [{
        id: Number,
        name: String,
        _id: false // Stops Mongoose from adding an _id to each genre object
    }],

    casts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cast' // Links to your 'Cast' model
    }],
    release_date: Date,
    original_language: String,
    tagline: String,
    vote_average: Number,
    vote_count: Number,
    runtime: Number,
}, { timestamps: true });

export const Shows = mongoose.model('Show', ShowsSchema);
