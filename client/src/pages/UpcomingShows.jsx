import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext.jsx";
import ThreeDCardDemo from "@/components/aceternity/3dCard.jsx";

const UpcomingShows = () => {
  const { axios } = useAppContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingShows = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/show/upcoming");
      setMovies(res.data.data.results || []);
    } catch (error) {
      console.error("Failed to fetch upcoming shows", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingShows();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-lg text-gray-400 animate-pulse">
          Loading upcoming movies…
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      {/* ===== HEADER ===== */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Upcoming Movies
        </h1>
        <p className="text-gray-400 mt-2">
          Discover movies that are coming soon to theaters
        </p>
      </div>

      {/* ===== MOVIES GRID ===== */}
      {movies.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400">No upcoming movies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-20 max-w-7xl mx-auto">
          {movies.map((movie) => (
            <div key={movie.id} className="flex justify-center">
              <ThreeDCardDemo movie={movie} isUpcoming />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingShows;
