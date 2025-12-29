import React, { useEffect, useState } from 'react'
// import { dummyTrailers } from '@/assets/assets.js'; // Assuming this is for testing
import ReactPlayer from 'react-player';
import axios from 'axios';
import { DraggableCardDemo } from '../aceternity/DraggableCard2.jsx';
// import './TrailersSection.css'; // <-- CSS file import removed

const TrailersSection = () => {
    const url=import.meta.env.VITE_API_URL

    const [videos, setVideos]=useState([]);
    const [loading, setLoading]=useState(true);
    const [currentTrailer, setCurrentTrailer]=useState();

    async function getTrailers(){
      try{
        const res=await axios.get(`${url}/trailers/allTrailers`)
        setVideos(res.data.data)
        setCurrentTrailer(res.data.data[0])
      }catch(err){
        console.log(err);
      } finally{
        setLoading(false);
      }
    }

    useEffect(()=>{
      getTrailers();
    }, [])

  return (
    // Main container for the whole section
    // w-full: 100% width
    // max-w-6xl: constrain width on large screens (1200px)
    // mx-auto: center the container
    // my-8: margin top/bottom (2rem)
    // px-4: padding left/right (1rem)
    // flex flex-col: stack children vertically
    // gap-8: space between children (2rem)
    <div className="w-full max-w-6xl mx-auto my-8 px-4 flex flex-col gap-8">
      {
        loading ? (
          // Centered loading message
          // min-h-[50vh]: give it height
          // flex items-center justify-center: center the text
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-xl font-medium text-gray-500">
              Loading trailers...
            </p>
          </div>
        ) : (
          // Wrapper to maintain 16:9 aspect ratio
          // aspect-video: sets padding-top: 56.25%
          // relative: for the absolute child player
          // rounded-xl: 12px border radius
          // overflow-hidden: to clip the video to the border-radius
          // shadow-lg: adds a nice "pop"
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
            <ReactPlayer 
              // absolute top-0 left-0: positions player inside the wrapper
              // w-full h-full: makes player fill the wrapper
              className="absolute top-0 left-0 w-full h-full"
              src={currentTrailer?.videoUrl}
              width="100%"
              height="100%"
              controls={true} // Add player controls
              playing={true} // Optional: auto-play
              light={true} // Optional: shows a thumbnail first
            />
          </div>
        )
      }

    {/* Container for the draggable cards */}
    <div className="w-full">
      <DraggableCardDemo
        videos={videos}
        onclick={(data)=>{
          setCurrentTrailer(data)
        }
        }
      />
    </div>
    </div>
  )
}

export default TrailersSection