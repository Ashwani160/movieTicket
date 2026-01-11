import FeaturedSection from '@/components/custom/FeaturedSection.jsx'
import HeroSection from '@/components/custom/HeroSection.jsx'
import React, { useEffect } from 'react'
// import TrailersSection from '@/components/custom/TrailersSection.jsx'
import TrailersSection from '@/components/custom/TrailersSection.jsx'
import { useAuth } from "@clerk/clerk-react";

import {useAppContext} from "../context/AppContext.jsx"

const Home = () => {
  
  // const name=useAppContext().name;
  // console.log(name);


  const { getToken } = useAuth();
  
  const findToken = async () => {
    const token = await getToken(); 
    console.log(token);
  };
useEffect(() => {

  findToken();
}, []);
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
      {/* <TrailersSection /> */}
    </>
  )
}

export default Home