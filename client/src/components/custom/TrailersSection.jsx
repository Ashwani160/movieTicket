import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { DraggableCardDemo } from "../aceternity/DraggableCard";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

const TrailersSection = () => {
  const { shows } = useAppContext();

  const [movies, setMovies] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [currentBackdrop, setCurrentBackdrop] = useState(null);

  // Convert shows → draggable cards
  useEffect(() => {
    if (!shows?.length) return;

    const mapped = shows.map((movie) => ({
      _id: movie._id,
      title: movie.title,
      tmdbId: movie._id,
      image: `${IMAGE_BASE}${movie.backdrop_path || movie.poster_path}`,
    }));

    setMovies(mapped);
    setCurrentBackdrop(mapped[0]?.image);
  }, [shows]);

  // Fetch trailer
  const fetchTrailer = async (movie) => {
    try {
      setCurrentBackdrop(movie.image);

      const res = await axios.get(
        `${TMDB_BASE}/movie/${movie.tmdbId}/videos`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            accept: "application/json",
          },
        }
      );

      const results = res.data?.results || [];

      const trailer =
        results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
        ) ||
        results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        results.find((v) => v.site === "YouTube" && v.type === "Teaser");

      if (!trailer) {
        setCurrentTrailer(null);
        return;
      }

      setCurrentTrailer({
        title: movie.title,
        url: `https://www.youtube.com/watch?v=${trailer.key}`,
      });
    } catch (err) {
      console.error("Trailer fetch failed:", err.response?.data || err.message);
    }
  };

  return (
    <section className="my-24">
      <h2 className="text-2xl font-bold mb-8 px-4">
        Latest Trailers
      </h2>

      {/* ===== PLAYER ===== */}
      <div className="relative w-full max-w-6xl mx-auto mb-16">
        <div className="relative aspect-video rounded-2xl overflow-hidden">

          {/* Backdrop */}
          {currentBackdrop && (
            <img
              src={currentBackdrop}
              alt="Trailer backdrop"
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

          {/* Player */}
          <div className="absolute inset-0 z-10">
            {currentTrailer ? (
              <ReactPlayer
                src={currentTrailer.url}
                controls
                width="100%"
                height="100%"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-lg">
                Select a movie to play its trailer
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== DRAGGABLE MOVIES ===== */}
      <DraggableCardDemo
        videos={movies}
        onSelect={fetchTrailer}
      />
    </section>
  );
};

export default TrailersSection;
