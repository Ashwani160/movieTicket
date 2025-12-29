import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import ThreeDCardDemo from '../aceternity/3dCard'
import { dummyShowsData } from '@/assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FeaturedSection = () => {

  const url=import.meta.env.VITE_API_URL;
  const [shows, setShows] = useState([])
  const [loading, setLoading]=useState(true)

  const navigate=useNavigate();

    useEffect(() => {
    if (!url) return
    const fetchShows = async () => {
      try {
        const res = await axios.get(`${url}/shows/allShows`)
        // console.log(res);
        const fetchedShows=res.data?.data ||[]
        setShows(fetchedShows)
        // console.log(shows[0].runtime)
      } catch (err) {
        console.log('fetch shows error:', err?.message || err)
      } finally{
        setLoading(false);
      }
    }

    fetchShows()
  }, [url])
  
  return (
    <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-semibold">Now Showing</p>
            <Button 
              onClick={()=> navigate('/movies')}
            >Show all</Button>
        </div>
        <div className="flex flex-wrap justify-evenly">
          {
            loading ?(
              <p>Loading</p>
            ) 
            :(
              shows.slice(0,4).map((movie, index)=>{
                return (
                  <ThreeDCardDemo key={index} movie={movie} />
                )
              })
            )
          }
          {/* {dummyShowsData.slice(0,4).map((movie, index)=>{
            return (
              <ThreeDCardDemo key={index} movie={movie} />
            )
          })} */}
        </div>

        <div>

        </div>
    </div>
  )
}

export default FeaturedSection