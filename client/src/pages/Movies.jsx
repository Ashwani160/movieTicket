import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ThreeDCardDemo from "../components/aceternity/3dCard.jsx"
// No CSS import is needed when using Tailwind

const Movies = () => {

  const [movies, setMovies] = useState([]);
  // STEP 1: Add isLoading state. Default to 'true' since we fetch on load.
  const [isLoading, setIsLoading] = useState(true); 
  const url = import.meta.env.VITE_API_URL;

  async function getShows (){
    try {
      // Don't need to set loading to true here, as it's true by default
      let res = await axios.get(`${url}/shows/allShows`)
      res = res.data?.data;
      
      // Filter out any potential bad data (if you still have key warnings)
      const validMovies = res.filter(movie => movie.id);

      setMovies(validMovies);
      console.log(movies); // As requested: will still log the old state
    } catch(err) {
      console.log(err);
      // You could also set an error state here
    } finally {
      // STEP 2: This is crucial.
      // This runs whether the API call succeeded OR failed.
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    getShows();
  },[]) // This empty dependency array ensures it only runs once on mount

  // STEP 3: Create the 3-part render logic
  
  // State 1: We are actively loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        {/* Use 'animate-pulse' for a simple, elegant loading effect */}
        <h2 className="text-3xl text-gray-500 animate-pulse">
          Loading movies...
        </h2>
      </div>
    );
  }

  // State 2: Loading is done AND we have movies
  if (movies.length > 0) {
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
          {movies.map((movie) => {
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