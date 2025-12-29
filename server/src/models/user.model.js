import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{type: String, required: true, unique: true},
    username:{type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    image: { type: String, required: false},
});

export const User =new mongoose.model("User", userSchema);