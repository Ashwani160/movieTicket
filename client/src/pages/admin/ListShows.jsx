import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w154';

const ListShows = () => {
  const { axios, getToken } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShows = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('/admin/all-shows', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShows(res.data.data.allShows || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading shows…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">All Shows</h1>
        <p className="text-gray-400 text-sm">
          Manage and monitor all scheduled movie shows
        </p>
      </div>

      {/* ================= SHOWS LIST ================= */}
      {shows.length === 0 ? (
        <div className="text-gray-400">No shows found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shows.map((show) => (
            <ShowCard key={show._id} show={show} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= SHOW CARD ================= */
const ShowCard = ({ show }) => {
  const bookedSeats = Object.keys(show.occupiedSeats || {}).length;

  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-primary-500/60 transition">
      {/* Accent strip */}
      <div className="absolute left-0 top-0 h-full w-1 bg-primary-500 rounded-l-2xl" />

      <div className="flex gap-4">
        {/* Poster */}
        <img
          src={
            show.movie?.poster_path
              ? `${POSTER_BASE}${show.movie.poster_path}`
              : ''
          }
          alt={show.movie?.title}
          className="w-24 h-36 object-cover rounded-lg"
        />

        {/* Info */}
        <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold">
            {show.movie?.title}
          </h2>

          <p className="text-sm text-gray-400 line-clamp-2">
            {show.movie?.overview}
          </p>

          <div className="flex flex-wrap gap-4 text-sm mt-2">
            <InfoItem label="Show Time">
              {new Date(show.showDateTime).toLocaleString()}
            </InfoItem>

            <InfoItem label="Price">
              ₹{show.showPrice}
            </InfoItem>

            <InfoItem label="Booked Seats">
              <span className="text-primary-500 font-semibold">
                {bookedSeats}
              </span>
            </InfoItem>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL INFO ITEM ================= */
const InfoItem = ({ label, children }) => (
  <div>
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm text-gray-200">{children}</div>
  </div>
);

export default ListShows;
