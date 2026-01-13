import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ThreeDCardDemo from "../components/aceternity/3dCard.jsx"
import { useAppContext } from '@/context/AppContext.jsx';
// No CSS import is needed when using Tailwind

const Movies = () => {

  const {shows}= useAppContext();
  
  if (shows.length > 0) {
    return (
      // Add padding to the whole page container
      <div className="p-8">
        {/* This is the responsive grid:
          - 'grid': Activates CSS Grid
          - 'grid-cols-1': Default to 1 column on mobile
          - 'md:grid-cols-2': 2 columns on medium screens
          - 'lg:grid-cols-3': 3 columns on large screens
          - 'xl:grid-cols-4': 4 columns on extra-large screens
          - 'gap-8': Adds a nice 2rem gap between all grid items
        */}
        <h3>Now Showing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {shows.map((movie) => {
            return <ThreeDCardDemo 
              movie={movie}
              key={movie.id}
            />
          })}
        </div>
      </div>
    );
  }

  // State 3: Loading is done AND we have no movies
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <h2 className="text-2xl text-gray-500 italic">
        No movies found.
      </h2>
    </div>
  );
}

export default Movies