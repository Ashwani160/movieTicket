import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat.js";
import DateSelect from "../components/custom/DateSelect.jsx";
import ThreeDCardDemo from "@/components/aceternity/3dCard";
import { useAppContext } from "@/context/AppContext.jsx";

const MovieDetail = () => {
  const { axios } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // ✅ start null

  // 🔹 Fetch movie + show dates
  const getMovie = async () => {
    try {
      const res = await axios.get(`/show/get-show/${id}`);
      setMovie(res.data.data.movie);
      setShowTimes(res.data.data.showTimes);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch recommended movies
  const getMovies = async () => {
    try {
      const res = await axios.get(`/show/all`);
      setMovies(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    setSelectedDate(null); // ✅ reset on movie change
    getMovie().finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (movie) getMovies();
  }, [movie]);

  // ✅ Only dates that actually have shows
  const availableDates = showTimes.map((s) => s.date);

  // Proceed to booking
  const handleProceedToBooking = () => {
    if (!selectedDate) return;

    const dateString = selectedDate.toLocaleDateString("en-CA");
    navigate(`/movies/${id}/${dateString}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-900">
        <p className="text-2xl animate-pulse text-white">Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-900">
        <p className="text-2xl text-red-500">Movie not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* ===== MOVIE DETAILS ===== */}
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Backdrop */}
        <div className="relative w-full h-[40vh] md:h-[60vh]">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-4xl p-4 md:p-8 -mt-20 md:-mt-32 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {movie.title}
          </h1>

          <div className="bg-gray-800/80 backdrop-blur rounded-lg p-6 shadow-2xl">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-pink-600 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {movie.overview}
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-yellow-400 text-3xl font-bold">
                  {movie.vote_average.toFixed(1)}
                </p>
                <p className="text-gray-400">Rating</p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  {timeFormat(movie.runtime)}
                </p>
                <p className="text-gray-400">Runtime</p>
              </div>
            </div>

            {/* ✅ DATE SELECT */}
            <DateSelect
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              availableDates={availableDates}
            />

            {/* ✅ BUTTON ENABLES ONLY WHEN DATE SELECTED */}
            <button
              disabled={!selectedDate}
              onClick={handleProceedToBooking}
              className={`w-full mt-4 py-3 rounded-lg text-lg font-bold transition
                ${
                  selectedDate
                    ? "bg-pink-600 hover:bg-pink-700 cursor-pointer"
                    : "bg-gray-600 cursor-not-allowed opacity-60"
                }`}
            >
              See Showtimes
            </button>
          </div>
        </div>
      </div>

      {/* ===== RECOMMENDED ===== */}
      <div className="bg-gray-900 text-white py-20">
        <h2 className="text-3xl font-bold text-center mb-14">
          Recommended Movies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-24 px-6 max-w-7xl mx-auto">
          {movies.map((recMovie) => (
            <div key={recMovie._id} className="flex justify-center">
              <ThreeDCardDemo movie={recMovie} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
