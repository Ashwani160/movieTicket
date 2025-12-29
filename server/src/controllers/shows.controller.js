import mongoose from "mongoose";
import { Casts } from "../models/casts.model.js";
import { Shows } from "../models/shows.model.js"; // Corrected model file name to shows.model.js
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getRandomCastIds = (allCastIds, count) => {
    const randomIds = new Set();
    // Ensure we don't try to get more casts than available or get stuck in a loop
    const maxCount = Math.min(count, allCastIds.length);

    while (randomIds.size < maxCount) {
        const randomIndex = Math.floor(Math.random() * allCastIds.length);
        randomIds.add(allCastIds[randomIndex]);
    }
    return Array.from(randomIds);
};

const addShows = catchAsync(async (req, res) => {
    // 1. Fetch all cast IDs from the database
    const allCasts = await Casts.find().select('_id'); // .select('_id') gets only the IDs

    if (!allCasts || allCasts.length === 0) {
        throw new ApiError(404, "No casts found in the database. Please add casts first.");
    }

    // Convert the array of objects like [{_id: '...'}, ...] to a simple array ['...', '...']
    const castIds = allCasts.map(cast => cast._id);

    let uploaded;

    if (Array.isArray(req.body)) {
        // 2. Process the array of shows
        const showsToInsert = req.body.map(show => {
            // Destructure to remove the old 'casts' array from the dummy data
            // NOTE: The _id field needs to be removed as Mongoose will generate its own _id
            const { casts, _id, ...restOfShow } = show; 
            
            // 3. Get a random number of random cast IDs (e.g., 5 to 10)
            const randomCastCount = Math.floor(Math.random() * 6) + 5; // Gets 5, 6, 7, 8, 9, or 10
            const randomCastIds = getRandomCastIds(castIds, randomCastCount);

            // 4. Return the new show object with the random IDs
            return {
                ...restOfShow,
                casts: randomCastIds // Assign the array of ObjectIds
            };
        });

        // Use findOneAndUpdate with upsert: true to insert or update based on 'id'
        const bulkOps = showsToInsert.map(show => ({
            updateOne: {
                filter: { id: show.id }, // Find document by the 'id' field
                update: { $set: show }, 
                // update:{show}
                upsert: true
            }
        }));

        const result = await Shows.bulkWrite(bulkOps);

        // const reult2= await Shows.insertMany(showsToInsert)

        uploaded = showsToInsert.length; // Simply return the count of items processed
        
        if (result.nUpserted + result.nModified === 0 && uploaded > 0) {
            // This is unlikely if bulkWrite succeeds but acts as a safety
            console.warn("Bulk write completed but no documents were updated or inserted.");
        }


    } else {
        // Logic for adding a single show
        const { casts, _id, ...restOfShow } = req.body;
        const randomCastCount = Math.floor(Math.random() * 6) + 5;
        const randomCastIds = getRandomCastIds(castIds, randomCastCount);

        const showData = {
            ...restOfShow,
            casts: randomCastIds
        };

        // Use findOneAndUpdate to handle single entry (insert or update)
        uploaded = await Shows.findOneAndUpdate({ id: showData.id }, showData, { 
            new: true, // Return the new document after update
            upsert: true, // Create the document if it doesn't exist
            setDefaultsOnInsert: true // Apply schema defaults when upserting
        });
        
        if (!uploaded) {
            throw new ApiError(400, "Show not uploaded or updated");
        }
    }

    return res.status(201).send(new ApiResponse(201, uploaded, "Shows added successfully"));
});

const allShows= catchAsync(async(req,res)=>{
    let shows=await Shows.find().select('-_id')
    console.log(shows);
    if(!shows){
        throw new ApiError(400, "unable to fetch the shows data")
    }
    return res.send(new ApiResponse(200, shows));
})

const getShow=catchAsync(async(req, res)=>{
    const id=req.params.id;
    if(!id){
        throw new ApiError(400, "no movie id provided")
    }
    console.log(id)
    const movie=await Shows.find({id:id});
    console.log(movie);
    return res.send(new ApiResponse(200, movie, "fetched successfully"))
})


export { 
    addShows,
    allShows,
    getShow
};
