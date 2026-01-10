import catchAsync from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import axios from "axios";
import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";

//api to get now playing movies from TBDM API
const getNowPlayingMovies=catchAsync(async(req , res)=>{
    const url = "https://api.themoviedb.org/3/movie/now_playing";

    try {
        const response = await axios.get(url, {
        params: {
            language: "en-US",
            page: 1
        },
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
        });
        const movies=response.data;
        return res.status(200).json(new ApiResponse(200, movies));

    } catch (error) {
        console.error(
        error.response ? error.response.data : error.message
        );
        throw new ApiError(500, error.message || "Failed to fetch now playing movies");
    }
    
})

const addMovieWithShow= catchAsync(async(req,res)=>{
    
    const {movieId, showsInput, showPrice}=req.body;
    let movie= await Movie.findById(movieId);
        try {
            //fetch movie details from TMDB API
            const [movieDetailResponse, movieCrieditsResponse]= await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
                    headers:{
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
                    headers:{
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    }
                })
            ]) 
            const movieDetail=movieDetailResponse.data;
            const moviesCredits=movieCrieditsResponse.data;
            const casts=moviesCredits.cast.slice(0,5).map((c)=>{
                return {
                    id:c.id,
                    name:c.name
                }
            })
            //store movie in db
            let storedMovie;
            if(!movie){
                storedMovie=await Movie.create({
                    _id: movieId,
                    title: movieDetail.title,
                    overview: movieDetail.overview,
                    poster_path: movieDetail.poster_path,
                    backdrop_path: movieDetail.backdrop_path,
                    release_date: movieDetail.release_date,
                    original_language: movieDetail.original_language,
                    tagline: movieDetail.tagline || "",
                    genres: movieDetail.genres || [],
                    casts,
                    vote_average: movieDetail.vote_average,
                    runtime: movieDetail.runtime
                })
            }
            //store shows in db
            const showsToInsert = [];

            for (const showDay of showsInput) {
                const { date, timings } = showDay;
                for (const time of timings) {
                    const showDateTime = new Date(`${date}T${time}:00`);
                    const exists = await Show.findOne({
                        movie: movieId,
                        showDateTime
                });
                if (!exists) {
                    showsToInsert.push({
                    movie: movieId,
                    showDateTime,
                    showPrice,
                    occupiedSeats: {}
                    });
                }
                }
            }

            if (showsToInsert.length) {
                await Show.insertMany(showsToInsert);
            }
            
            
            return res.status(200)
                .json(new ApiResponse(200, {storedMovie, showsAdded: showsToInsert.length}));

        } catch (error) {
            throw new ApiError(500, "Failed to fetch movie details");
        }
})

// API to get all shows
const getShows= catchAsync(async(req, res)=>{

    const movieIds = await Show.distinct("movie", {
    showDateTime: { $gte: new Date() }
    });
    console.log(movieIds)
    const uniqueMovies = await Movie.find({
    _id: { $in: movieIds }
    });

    return res
    .status(200)
    .json(new ApiResponse(200, uniqueMovies));
    
    // const shows= await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime:1});
    // const uniqueShows= new Set(shows.map((show)=>{
    //     return show.movie;
    // }))
    // return res.status(200).json(new ApiResponse(200, Array.from(uniqueShows)));

})

const getShow = catchAsync(async (req, res) => {
   const { movieId } = req.params;

  if (!movieId) {
    throw new ApiError(400, "movieId is required");
  }

  const result = await Show.aggregate([
    /* 1️⃣ Filter by movie & future shows */
    {
      $match: {
        movie: movieId,
        showDateTime: { $gte: new Date() }
      }
    },

    /* 2️⃣ Join movie collection */
    {
      $lookup: {
        from: "movies",           // collection name
        localField: "movie",
        foreignField: "_id",
        as: "movie"
      }
    },

    /* 3️⃣ Convert movie array to object */
    { $unwind: "$movie" },

    /* 4️⃣ Group shows by DATE */
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$showDateTime"
            }
          }
        },

        /* take movie only once */
        movie: { $first: "$movie" },

        /* push full show info */
        shows: {
          $push: {
            showId: "$_id",
            time: {
              $dateToString: {
                format: "%H:%M",
                date: "$showDateTime"
              }
            },
            showPrice: "$showPrice",
            occupiedSeats: "$occupiedSeats"
          }
        }
      }
    },

    /* 5️⃣ Sort by date */
    { $sort: { "_id.date": 1 } },

    /* 6️⃣ Shape final output */
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        shows: 1,
        movie: {
          _id: 1,
          title: 1,
          overview: 1,
          poster_path: 1,
          backdrop_path: 1,
          release_date: 1,
          original_language: 1,
          tagline: 1,
          genres: 1,
          casts: 1,
          vote_average: 1,
          runtime: 1
        }
      }
    }
  ]);

  if (!result.length) {
    throw new ApiError(404, "No shows found for this movie");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      movie: result[0].movie,
      showTimes: result.map(({ date, shows }) => ({
        date,
        shows
      }))
    })
  );
});

export {
    getNowPlayingMovies,
    addMovieWithShow,
    getShows,
    getShow
};