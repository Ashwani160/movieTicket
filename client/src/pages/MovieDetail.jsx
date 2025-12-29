import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // Import useNavigate
import timeFormat from '../lib/timeFormat.js'
import DateSelect from '../components/custom/DateSelect.jsx' // Import the new component
import ThreeDCardDemo from '@/components/aceternity/3dCard'

const MovieDetail = () => {

  const url = import.meta.env.VITE_API_URL
  const [movie, setMovie] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State for the selected date, defaults to today
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { id } = useParams()
  const navigate = useNavigate() // Initialize useNavigate hook

  const getMovie = async () => {
    try {
      const res = await axios.get(`${url}/shows/getShow/${id}`)
      setMovie(res.data?.data[0])
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const getMovies = async () => {
    try {
      const res = await axios.get(`${url}/shows/allShows`)
      let allMovies = res.data?.data;
      
      // Filter out the current movie from the recommendations
      if (movie && movie.id) {
        allMovies = allMovies.filter((m) => {
          return m.id != movie.id;
        })
      }
      
      // Limit to 4 recommendations
      allMovies = allMovies.slice(0, 4);

      setMovies(allMovies)
    } catch (err) {
      console.log(err);
    }
  }

  // Initial Load: Get the main movie details
  useEffect(() => {
    setLoading(true);
    setMovie(null);
    setMovies([]); // Clear previous recommendations
    if (id) {
      getMovie()
    }
  }, [id])

  // Secondary Load: Get recommendations once the main movie is loaded
  useEffect(() => {
    if (movie) {
      getMovies()
    }
  }, [movie])

  // Handler for the "See Showtimes" button
  const handleProceedToBooking = () => {
    // Use local date string (YYYY-MM-DD) to avoid UTC timezone shifts
    // 'en-CA' locale consistently formats as YYYY-MM-DD
    const dateString = selectedDate.toLocaleDateString('en-CA');
    
    // Navigate to the seat layout page with both movie ID and date
    navigate(`/movies/${id}/${dateString}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-900">
        <p className="text-2xl animate-pulse text-white">Loading...</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-900">
        <p className="text-2xl text-red-500">Movie not found.</p>
      </div>
    )
  }

  return (
    <>
      {/* --- UPPER SECTION: Movie Details --- */}
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Backdrop Image */}
        <div className="relative w-full h-[40vh] md:h-[60vh]">
          <img
            src={movie.backdrop_path}
            alt={movie.title || 'Movie backdrop'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto max-w-4xl p-4 md:p-8 -mt-20 md:-mt-32 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {movie.title || 'Movie Detail'}
          </h1>

          {/* Details Card */}
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-2xl p-6">
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id || genre.name}
                  className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-300 mb-6 text-base leading-relaxed">
              {movie.overview}
            </p>

            {/* Stats: Rating and Runtime */}
            <div className="flex flex-wrap gap-6 md:gap-10 items-center">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-3xl font-bold">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
                <span className="text-gray-400 mt-1">/ 10</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {timeFormat(movie.runtime)}
                </span>
                <span className="text-gray-400 mt-1">Runtime</span>
              </div>
            </div>

            {/* --- DATE SELECT COMPONENT --- */}
            <DateSelect 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />

            {/* --- BOOKING BUTTON --- */}
            <button
              onClick={handleProceedToBooking}
              className="w-full bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-lg 
                         hover:bg-pink-700 transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
              See Showtimes
            </button>

          </div>
        </div>
      </div>

      {/* --- LOWER SECTION: Recommended Movies --- */}
      {/* Added bg-gray-900 to match the upper section's theme */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Recommended Movies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies && movies.length > 0 &&
              movies.map((recMovie) => (
                <div
                  key={recMovie.id}
                  className="transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <ThreeDCardDemo movie={recMovie} />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default MovieDetail