import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.jsx";
import toast from "react-hot-toast";

/* ===============================
   SEAT MAP (STATIC)
================================ */
const seatRows = [
  ["A1","A2","A3","A4","A5","A6","A7","A8","A9"],
  ["B1","B2","B3","B4","B5","B6","B7","B8","B9"],
  ["C1","C2","C3","C4","C5","C6","C7","C8","C9"],
  ["D1","D2","D3","D4","D5","D6","D7","D8","D9"],
  ["E1","E2","E3","E4","E5","E6","E7","E8","E9"],
];

const SeatLayout = () => {
  const { axios, getToken } = useAppContext();
  const { id, date } = useParams(); // movieId + selected date
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loadingSeats, setLoadingSeats] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  /* ===============================
     1️⃣ Fetch showTimes for selected date
  =============================== */
  const fetchShowsForDate = async () => {
    try {
      const res = await axios.get(`/show/get-show/${id}`);
      const showTimes = res.data.data.showTimes || [];

      const todayShows =
        showTimes.find((d) => d.date === date)?.shows || [];

      setShows(todayShows);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load showtimes");
    }
  };

  /* ===============================
     2️⃣ Fetch occupied seats
  =============================== */
  const fetchOccupiedSeats = async (showId) => {
    try {
      setLoadingSeats(true);
      const res = await axios.get(`/booking/seats/${showId}`);
      setOccupiedSeats(res.data.data.occupiedSeats || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load occupied seats");
    } finally {
      setLoadingSeats(false);
    }
  };

  useEffect(() => {
    fetchShowsForDate();
  }, [id, date]);

  /* ===============================
     3️⃣ Seat selection
  =============================== */
  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  /* ===============================
     4️⃣ Create Booking
  =============================== */
  const handleCreateBooking = async () => {
    if (!selectedShow || selectedSeats.length === 0) return;

    try {
      setBookingLoading(true);
      const token= await getToken();
      await axios.post("/booking/create", {
        showId: selectedShow.showId,
        selectedSeats,
      }, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Booking successful!");

      // 🔜 Stripe payment will be added here
      navigate("/my-bookings");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Select Showtime & Seats
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">

        {/* ===============================
            LEFT: SHOWTIMES
        =============================== */}
        <div className="lg:w-1/4 bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Showtimes</h2>

          {shows.length === 0 && (
            <p className="text-neutral-400">No shows available</p>
          )}

          <div className="space-y-3">
            {shows.map((show) => (
              <button
                key={show.showId}
                onClick={() => {
                  setSelectedShow(show);
                  setSelectedSeats([]);
                  fetchOccupiedSeats(show.showId);
                }}
                className={`w-full py-3 rounded-lg font-medium transition
                  ${
                    selectedShow?.showId === show.showId
                      ? "bg-pink-600 text-white"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
              >
                {show.time}
              </button>
            ))}
          </div>
        </div>

        {/* ===============================
            RIGHT: SEAT MAP
        =============================== */}
        <div className="lg:w-3/4 bg-neutral-900 p-8 rounded-xl border border-neutral-800">

          {!selectedShow && (
            <p className="text-center text-neutral-400">
              Select a showtime to choose seats
            </p>
          )}

          {selectedShow && (
            <>
              {/* Screen */}
              <div className="mb-8 text-center">
                <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-2" />
                <p className="text-xs tracking-widest text-neutral-500">
                  SCREEN
                </p>
              </div>

              {/* Seats */}
              <div className="flex justify-center">
                <div className="grid gap-3">
                  {seatRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                      {row.map((seat) => {
                        const isOccupied = occupiedSeats.includes(seat);
                        const isSelected = selectedSeats.includes(seat);

                        return (
                          <button
                            key={seat}
                            disabled={isOccupied || loadingSeats}
                            onClick={() => handleSeatClick(seat)}
                            className={`w-10 h-10 rounded text-xs font-bold transition
                              ${
                                isOccupied
                                  ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-pink-600 text-white"
                                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                              }`}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                disabled={
                  bookingLoading ||
                  selectedSeats.length === 0
                }
                onClick={handleCreateBooking}
                className="w-full mt-10 bg-pink-600 hover:bg-pink-700
                           disabled:opacity-50 disabled:cursor-not-allowed
                           py-3 rounded-lg font-bold transition"
              >
                {bookingLoading
                  ? "Booking..."
                  : `Proceed (${selectedSeats.length} seats)`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
