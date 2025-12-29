"use client";


import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card.jsx";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import timeFormat from "@/lib/timeFormat.js";

function ThreeDCardDemo({movie}) {
  const navigate= useNavigate();

  return (
    <CardContainer className="inter-var">
      <CardBody
        className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white">
          {movie.title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-0 dark:text-neutral-300"
          >
            {movie.genres.map((genre)=> genre.name).join(' | ')} • {timeFormat(movie.runtime)}
        </CardItem>
        <CardItem translateZ="100" rotateX={20} rotateZ={-10} className="w-full mt-2">
          <img
            onClick={()=>navigate(`/movies/${movie.id}`)}
            src={movie.poster_path}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail" />
        </CardItem>
        <div className="flex justify-between items-center mt-4">
          <CardItem
            translateZ={20}
            translateX={-40}
            as="button"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white flex items-center gap-1">
            <Star className="w-4 h-4" /> {movie.vote_average}
          </CardItem>
          <CardItem onClick={()=>navigate(`/movies/${movie.id}`) }
            translateZ={20}
            translateX={40}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold">
            Buy Ticket→
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
export default ThreeDCardDemo;