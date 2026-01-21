import React from "react";
import DottedGlowBackgroundDemo from "./components/aceternity/dotted-glow-bg.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Movies from "./pages/Movies.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import SeatLayout from "./pages/SeatLayout.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Favorite from "./pages/Favorite.jsx";
import NavBar from "./components/custom/NavBar.jsx";
import Footer from "./components/custom/Footer.jsx";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.jsx";
import DashBoard from "./pages/admin/DashBoard.jsx";
import ListShows from "./pages/admin/ListShows.jsx";
import ListBookings from "./pages/admin/ListBookings.jsx";
import Layout from "./pages/admin/Layout.jsx";
import AddShows from "./pages/admin/AddShows.jsx";
import UpcomingShows from "./pages/UpcomingShows.jsx";
import Theater from "./pages/Theater.jsx"

function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  return (
    <>
      <Toaster />
      { !isAdminRoute && <NavBar/> }
      <div className="py-5">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/movies' element={<Movies/>}/>
          <Route path='/movies/:id' element={<MovieDetail/>}/>
          <Route path='/movies/:id/:date' element={<SeatLayout/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
          <Route path='/favorite' element={<Favorite/>}/>
          <Route path='/upcoming' element={<UpcomingShows/>}/>
          <Route path='/theater' element={<Theater/>}/>
          <Route path="/admin/*" element={<Layout />}>
            <Route index element={<DashBoard />} />
            <Route path="add-shows" element={<AddShows />} />
            <Route path="list-shows" element={<ListShows />} />
            <Route path="list-bookings" element={<ListBookings />} />
          </Route>
        </Routes>
      </div>
      {!isAdminRoute && <Footer/> }
    </>
  );
}

export default App;
