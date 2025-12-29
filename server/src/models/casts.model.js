import mongoose from "mongoose";

const CastsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Cast name is required"] // Add this
  },
  profile_path: {
    type: String,
    required: [true, "Profile path is required"] // Add this
  }
});

export const Casts = mongoose.model('Cast', CastsSchema);