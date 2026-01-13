import React from "react";
import { Button } from "../ui/button";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const BookingCard = ({ booking }) => {
  const { show, bookedSeats, amount, isPaid, _id } = booking;
  const { movie, showDateTime } = show;

  const dateObj = new Date(showDateTime);

  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg hover:border-pink-500/40 transition-all duration-300 shadow-xl">
      
      {/* GRADIENT BORDER */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition" />

      <div className="relative flex flex-col md:flex-row">
        
        {/* POSTER */}
        <div className="md:w-1/3 h-56 md:h-auto overflow-hidden">
          <img
            src={
              movie.poster_path
                ? `${IMAGE_BASE}${movie.poster_path}`
                : movie.backdrop_path
            }
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          
          {/* HEADER */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-white leading-tight">
                {movie.title}
              </h3>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                ${
                  isPaid
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {isPaid ? "PAID" : "UNPAID"}
              </span>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Booking ID:{" "}
              <span className="font-mono text-neutral-400">
                {_id.slice(-6).toUpperCase()}
              </span>
            </p>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-neutral-500 text-xs uppercase">Date</p>
                <p className="text-neutral-200 font-medium">{dateStr}</p>
              </div>

              <div>
                <p className="text-neutral-500 text-xs uppercase">Time</p>
                <p className="text-neutral-200 font-medium">{timeStr}</p>
              </div>

              <div className="col-span-2">
                <p className="text-neutral-500 text-xs uppercase">Seats</p>
                <p className="text-pink-400 font-semibold">
                  {bookedSeats.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex items-center justify-between border-t border-neutral-800 pt-4">
            <div>
              <p className="text-xs text-neutral-500">Total Amount</p>
              <p className="text-2xl font-extrabold text-white">
                ₹{amount}
              </p>
            </div>

            {!isPaid && (
              <Button
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2 rounded-xl"
              >
                Pay Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
