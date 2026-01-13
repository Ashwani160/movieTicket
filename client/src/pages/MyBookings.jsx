import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext.jsx";
import BookingCard from "../components/custom/BookingCard";

const MyBookings = () => {
  const { getToken, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get("/user/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 tracking-tight">
          🎟 My Bookings
        </h1>

        {/* LOADING */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-neutral-900/60 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* BOOKINGS */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-xl font-semibold">
              You haven’t booked any movies yet
            </p>
            <p className="text-sm mt-2">
              Start exploring and book your first show!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
