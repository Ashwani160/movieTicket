import React from 'react';
import { Button } from '../ui/button.jsx';

const BookingCard = ({ booking }) => {
  const { show, bookedSeats, amount, isPaid, _id } = booking;
  const { movie, showDateTime } = show;
  
  // Format Date: e.g., "Mon, 30 Jun 2025"
  const dateObj = new Date(showDateTime);
  const dateStr = dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  // Format Time: e.g., "02:30 AM"
  const timeStr = dateObj.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const handlePay=async()=>{
    console.log("pay")
  }
  return (
    // Background colors removed, kept border for structure
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700 flex flex-col md:flex-row w-full max-w-3xl mx-auto">
      
      {/* Left: Movie Poster - Reduced width */}
      <div className="md:w-1/4 h-32 md:h-auto relative flex-shrink-0">
        <img 
          src={movie.poster_path || movie.backdrop_path} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Mobile Paid/Unpaid Badge */}
        <div className="absolute top-1 right-1 md:hidden">
           <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isPaid ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {isPaid ? 'PAID' : 'UNPAID'}
            </span>
        </div>
      </div>

      {/* Right: Details - Compact padding */}
      <div className="p-3 md:p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
             <h3 className="text-lg font-bold text-white mb-0.5 truncate" title={movie.title}>
              {movie.title}
            </h3>
            {/* Desktop Paid/Unpaid Badge */}
            <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${isPaid ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
              {isPaid ? 'PAID' : 'UNPAID'}
            </span>
          </div>
         
          <p className="text-gray-500 text-[10px] mb-3">Booking ID: <span className="font-mono">{_id.slice(-6).toUpperCase()}</span></p>

          {/* Info Grid - Compact text */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs mb-2">
            
            {/* Date */}
            <div className="flex flex-col">
              <span className="text-gray-600 text-[10px] uppercase">Date</span>
              <span className="text-gray-300 font-medium">{dateStr}</span>
            </div>

            {/* Time */}
            <div className="flex flex-col">
              <span className="text-gray-600 text-[10px] uppercase">Time</span>
              <span className="text-gray-300 font-medium">{timeStr}</span>
            </div>

            {/* Seats */}
            <div className="flex flex-col col-span-2">
              <span className="text-gray-600 text-[10px] uppercase">Seats</span>
              <span className="text-pink-500 font-medium break-words">
                {bookedSeats.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer: Total Amount */}
        <div className="pt-2 border-t border-gray-800 flex justify-between items-center">
          <span className="text-gray-500 text-xs">Total</span>
          <span className="text-lg font-bold text-white">
            ${amount}
          </span>
        </div>
        <div>
            {!isPaid && (<Button onClick={()=> handlePay()}>Pay Now</Button>)}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;