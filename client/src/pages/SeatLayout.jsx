import React, { useState, useEffect } from 'react';
import {useNavigate, useParams } from 'react-router-dom'; // To get movie ID and date

const SeatLayout = () => {
  const { id, date } = useParams(); // Get movie ID and date from URL
  const navigate=useNavigate();
  // Dummy data for available timings
  const dummyTimings = [
    { time: '06:30 AM', id: 't1' },
    { time: '08:30 AM', id: 't2' },
    { time: '10:30 AM', id: 't3' },
    { time: '01:00 PM', id: 't4' },
    { time: '03:30 PM', id: 't5' },
  ];

  // Dummy data for seats
  const seatRows = [
    ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
    ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
    ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
    ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'],
    ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'],
    ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'],
    ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9'],
    ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'],
    ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9'],
  ];

  const occupiedSeats = ['B3', 'B5', 'B6']; // Example occupied seats

  const [selectedTiming, setSelectedTiming] = useState(dummyTimings[2].id); // Default to 10:30 AM
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Function to handle seat click
  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((seat) => seat !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  };

  // Function to handle "Proceed to Checkout"
  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat!');
      return;
    }
    if (!selectedTiming) {
      alert('Please select a show timing!');
      return;
    }
    
    const timingLabel = dummyTimings.find(t => t.id === selectedTiming)?.time;
    
    console.log('Proceeding to checkout with:', {
      movieId: id,
      date: date,
      timing: timingLabel,
      seats: selectedSeats,
    });
    navigate('/my-bookings')
    // alert(`Proceeding to checkout for Movie ID: ${id}, Date: ${date}, Timing: ${timingLabel}, Seats: ${selectedSeats.join(', ')}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 font-sans">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">
          Select Your Seats
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Available Timings */}
          <div className="lg:w-1/4 h-fit bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-neutral-200">Showtime</h2>
            <div className="space-y-3">
              {dummyTimings.map((timing) => (
                <button
                  key={timing.id}
                  onClick={() => setSelectedTiming(timing.id)}
                  className={`w-full text-left py-3 px-5 rounded-xl transition-all duration-200 flex justify-between items-center group
                              ${selectedTiming === timing.id
                                ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/30 scale-105'
                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                              }`}
                >
                  <span className="font-medium">{timing.time}</span>
                  {selectedTiming === timing.id && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Seat Layout */}
          <div className="lg:w-3/4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col items-center">
            
            {/* Screen Indicator */}
            <div className="w-full max-w-lg mb-10 text-center perspective-500">
               <div className="h-1.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mb-3 shadow-[0_0_15px_rgba(236,72,153,0.6)]"></div>
               <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase font-medium">Screen This Way</p>
            </div>

            {/* Seat Grid Container */}
            <div className="overflow-x-auto w-full flex justify-center pb-4">
              <div className="grid gap-3 min-w-max">
                {seatRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-3">
                    
                    {/* Row Label */}
                    <div className="w-6 text-neutral-500 font-mono text-sm font-bold flex justify-center">
                      {String.fromCharCode(65 + rowIndex)}
                    </div>

                    <div className="flex gap-2">
                      {row.map((seatId) => {
                        const isSelected = selectedSeats.includes(seatId);
                        const isOccupied = occupiedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            onClick={() => handleSeatClick(seatId)}
                            disabled={isOccupied}
                            className={`
                              w-9 h-9 md:w-10 md:h-10 rounded-lg text-[10px] md:text-xs font-bold transition-all duration-200 relative
                              flex items-center justify-center
                              ${isOccupied
                                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-800'
                                : isSelected
                                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 transform -translate-y-1'
                                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-neutral-700'
                              }
                            `}
                          >
                            {seatId.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm mt-8 mb-10 pt-6 border-t border-neutral-800 w-full">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-neutral-800 border border-neutral-700"></div>
                <span className="text-neutral-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-pink-600 shadow-sm"></div>
                <span className="text-white">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-neutral-800 border border-neutral-800 opacity-50"></div>
                <span className="text-neutral-500">Occupied</span>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="w-full max-w-md bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-neutral-400">Selected Seats:</span>
                <span className="text-white font-mono">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}
                </span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 px-6 rounded-lg text-base 
                           transition-all duration-200 transform active:scale-[0.98]
                           focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-neutral-900
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-600"
                disabled={selectedSeats.length === 0 || !selectedTiming}
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;