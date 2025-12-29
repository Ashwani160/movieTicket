import React, { useEffect, useState } from 'react';
import BookingCard from '../components/custom/BookingCard';
import { dummyBookingData } from '@/assets/assets.js'; // Importing data from assets

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      // Simulating API delay to mimic a real fetch
      setTimeout(() => {
        setBookings(dummyBookingData);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    getMyBookings();
  }, [])

  return (
    // Removed bg-gray-900, keeping text-white assuming global dark theme
    <div className="min-h-screen text-white py-10 px-4 md:px-8">
      {/* Reduced max-width to 4xl for a focused single-column list */}
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 border-b border-gray-800 pb-4">
          My Bookings
        </h1>

        {loading ? (
          // Updated skeleton: Removed bg-gray-800, used border for visibility
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-xl border border-gray-800 animate-pulse w-full"></div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          // Changed from Grid to Flex/Space-y for single row layout
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;