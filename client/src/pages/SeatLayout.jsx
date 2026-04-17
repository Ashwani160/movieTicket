import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext.jsx";
import { SignIn } from "@clerk/clerk-react";
import { X } from "lucide-react";
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
  const { axios, getToken, user } = useAppContext();
  const { id, date } = useParams(); // movieId + selected date
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [resumeBookingAfterLogin, setResumeBookingAfterLogin] = useState(false);

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
  const createBooking = async () => {
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

  const handleCreateBooking = async () => {
    if (!selectedShow || selectedSeats.length === 0) return;

    if (!user) {
      setResumeBookingAfterLogin(true);
      setShowLoginModal(true);
      return;
    }

    await createBooking();
  };

  useEffect(() => {
    if (!user || !resumeBookingAfterLogin) return;

    setShowLoginModal(false);
    setResumeBookingAfterLogin(false);
    createBooking();
  }, [user, resumeBookingAfterLogin]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className={showLoginModal ? "pointer-events-none select-none blur-[6px]" : ""}>
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

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950/95 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <button
              type="button"
              onClick={() => {
                setShowLoginModal(false);
                setResumeBookingAfterLogin(false);
              }}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close login modal"
            >
              <X size={18} />
            </button>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_top,#fb7185_0%,rgba(251,113,133,0.18)_30%,transparent_65%),linear-gradient(160deg,#101010_5%,#18181b_55%,#0a0a0a_100%)] p-10">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.04)_45%,transparent_100%)]" />
                <div className="relative">
                  <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.25em] text-pink-200">
                    Continue Booking
                  </p>
                  <h2 className="max-w-sm text-4xl font-semibold leading-tight text-white">
                    Sign in to lock your seats before they disappear.
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-6 text-neutral-300">
                    Your selected showtime and seats stay on this page. Once you log in, the booking flow resumes automatically.
                  </p>
                </div>

                <div className="relative grid gap-3 text-sm text-neutral-200">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    Selected seats: {selectedSeats.length || 0}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    Showtime: {selectedShow?.time || "Choose a showtime"}
                  </div>
                </div>
              </div>

              <div className="flex min-h-[720px] items-center justify-center bg-neutral-950 p-4 sm:p-8">
                <SignIn
                  routing="hash"
                  forceRedirectUrl={currentPath}
                  fallbackRedirectUrl={currentPath}
                  appearance={{
                    elements: {
                      rootBox: "w-full flex justify-center",
                      card: "w-full max-w-md border border-white/10 bg-neutral-900/95 shadow-none",
                      headerTitle: "text-white",
                      headerSubtitle: "text-neutral-400",
                      socialButtonsBlockButton: "border-white/10 bg-neutral-800 text-white hover:bg-neutral-700",
                      formButtonPrimary: "bg-pink-600 hover:bg-pink-700 text-white shadow-none",
                      formFieldInput: "border-white/10 bg-neutral-950 text-white",
                      formFieldLabel: "text-neutral-300",
                      footerActionText: "text-neutral-400",
                      footerActionLink: "text-pink-400 hover:text-pink-300",
                      dividerLine: "bg-white/10",
                      dividerText: "text-neutral-500",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
