"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card.jsx";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "@/lib/timeFormat.js";

const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

function ThreeDCardDemo({ movie, isUpcoming = false }) {
  const navigate = useNavigate();

  return (
    <CardContainer className="inter-var">
      <CardBody
        className="relative group/card bg-zinc-900 border border-zinc-800 
        w-auto sm:w-[20rem] rounded-xl p-6 
        hover:border-primary-500/60 transition"
      >
        {/* Badge for Upcoming */}
        {isUpcoming && (
          <span className="absolute top-3 right-3 z-10 text-xs font-semibold
            bg-yellow-500 text-black px-3 py-1 rounded-full">
            Coming Soon
          </span>
        )}

        {/* Movie title */}
        <CardItem translateZ="50" className="text-xl font-bold text-white">
          {movie.title}
        </CardItem>

        {/* Genres + runtime (runtime may not exist for upcoming) */}
        <CardItem
          as="p"
          translateZ="60"
          className="text-gray-400 text-sm max-w-sm mt-1"
        >
          {movie.genres?.map((g) => g.name).join(" | ")}
          {!isUpcoming && movie.runtime
            ? ` • ${timeFormat(movie.runtime)}`
            : ""}
        </CardItem>

        {/* Poster */}
        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={-10}
          className="w-full mt-3 cursor-pointer"
        >
          <img
            onClick={() => !isUpcoming && navigate(`/movies/${movie._id}`)}
            src={
              movie.poster_path
                ? `${POSTER_BASE}${movie.poster_path}`
                : "/placeholder.jpg"
            }
            className="h-60 w-full object-cover rounded-xl 
            group-hover/card:shadow-xl"
            alt={movie.title}
          />
        </CardItem>

        {/* Footer (hidden for upcoming) */}
        {!isUpcoming && (
          <div className="flex justify-between items-center mt-4">
            <CardItem
              translateZ={20}
              translateX={-40}
              as="div"
              className="flex items-center gap-1 text-sm text-gray-300"
            >
              <Star className="w-4 h-4 text-primary-500" />
              {movie.vote_average}
            </CardItem>

            <CardItem
              onClick={() => navigate(`/movies/${movie._id}`)}
              translateZ={20}
              translateX={40}
              as="button"
              className="px-4 py-2 rounded-xl 
              bg-primary-500 text-black text-xs font-bold 
              hover:bg-primary-dull transition"
            >
              Buy Ticket →
            </CardItem>
          </div>
        )}
      </CardBody>
    </CardContainer>
  );
}

export default ThreeDCardDemo;
