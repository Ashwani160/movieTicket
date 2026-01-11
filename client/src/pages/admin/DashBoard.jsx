import { useAppContext } from '@/context/AppContext.jsx';
import React, { useEffect, useState } from 'react';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w154';

const DashBoard = () => {
  const { axios, getToken } = useAppContext();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboardData(res.data.data.dashboardData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-gray-400">No data available</div>;
  }

  const { totalBookings, totalRevenue, totalUsers, activeShows } =
    dashboardData;

  return (
    <div className="space-y-12">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Overview of bookings, revenue and active shows
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={totalBookings} />
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Active Shows" value={activeShows.length} />
      </div>

      {/* ================= ACTIVE SHOWS ================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Shows</h2>
          <span className="text-xs px-3 py-1 rounded-full bg-primary-500/10 text-primary-500">
            Live
          </span>
        </div>

        {activeShows.length === 0 ? (
          <p className="text-gray-400">No active shows</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-zinc-800 text-gray-400">
                <tr>
                  <th className="text-left p-3">Movie</th>
                  <th className="text-left p-3">Show Time</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Seats Booked</th>
                </tr>
              </thead>

              <tbody>
                {activeShows.map((show) => (
                  <tr
                    key={show._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
                  >
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={
                          show.movie?.poster_path
                            ? `${POSTER_BASE}${show.movie.poster_path}`
                            : ''
                        }
                        alt={show.movie?.title}
                        className="w-12 h-16 object-cover rounded-md"
                      />
                      <span className="font-medium">
                        {show.movie?.title}
                      </span>
                    </td>

                    <td className="p-3 text-gray-300">
                      {new Date(show.showDateTime).toLocaleString()}
                    </td>

                    <td className="p-3 text-gray-300">
                      ₹{show.showPrice}
                    </td>

                    <td className="p-3 font-semibold text-primary-500">
                      {Object.keys(show.occupiedSeats || {}).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value }) => (
  <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 overflow-hidden">
    {/* Accent strip */}
    <div className="absolute left-0 top-0 h-full w-1 bg-primary-500" />

    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold mt-1 text-primary-500">
      {value}
    </div>
  </div>
);

export default DashBoard;
