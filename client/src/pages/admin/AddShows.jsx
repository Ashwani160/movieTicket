import { useAppContext } from '@/context/AppContext.jsx';
import React, { useEffect, useState } from 'react'

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342'

const AddShows = () => {
  const { axios, user, getToken, fetchShows } = useAppContext();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);

  // showsInput: [{ date: 'YYYY-MM-DD', timings: ['HH:MM', ...] }, ...]
  const [showsInput, setShowsInput] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTimeByDate, setNewTimeByDate] = useState({});
  const [showPrice, setShowPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const getNowPlayingMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await axios.get('/show/now-playing', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // TMDB returns an object with `results` usually
      const payload = res?.data?.data?.results || res?.data?.data || [];
      setMovies(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNowPlayingMovies();
  }, []);

  function addDate() {
    if (!newDate) return;
    if (showsInput.some((s) => s.date === newDate)) {
      return;
    }
    setShowsInput((s) => [...s, { date: newDate, timings: [] }]);
    setNewDate('');
  }

  function addTimeToDate(date) {
    const time = (newTimeByDate[date] || '').trim();
    if (!time) return;
    setShowsInput((prev) =>
      prev.map((entry) =>
        entry.date === date
          ? { ...entry, timings: Array.from(new Set([...entry.timings, time])) }
          : entry
      )
    );
    setNewTimeByDate((prev) => ({ ...prev, [date]: '' }));
  }

  function removeTime(date, time) {
    setShowsInput((prev) => prev.map((e) => (e.date === date ? { ...e, timings: e.timings.filter((t) => t !== time) } : e)));
  }

  function removeDate(date) {
    setShowsInput((prev) => prev.filter((e) => e.date !== date));
    setNewTimeByDate((prev) => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
  }

  async function submitShows() {
    setSubmitting(true);
    setSuccessMsg('');
    try {
      if (!selectedMovie) throw new Error('Please select a movie');
      if (!showsInput.length) throw new Error('Please add at least one date with times');
      for (const entry of showsInput) {
        if (!entry.timings || !entry.timings.length) throw new Error(`Please add at least one time for ${entry.date}`);
      }
      if (!showPrice) throw new Error('Please set a show price');

      const token = await getToken();
      const body = {
        movieId: selectedMovie.id || selectedMovie._id || selectedMovie._id,
        showsInput,
        showPrice: Number(showPrice),
      };

      const res = await axios.post('/show/add-show', body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res?.data?.success) {
        setSuccessMsg('Shows added successfully');
        // reset
        setSelectedMovie(null);
        setShowsInput([]);
        setShowPrice('');
        // refresh global shows list
        if (fetchShows) fetchShows();
      } else {
        throw new Error(res?.data?.message || 'Failed to add shows');
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Shows</h1>

      {loading ? (
        <p>Loading now-playing movies...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {movies.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMovie(m)}
                className={`flex flex-col items-center rounded-lg overflow-hidden border p-2 hover:shadow transition ${selectedMovie?.id === m.id ? 'ring-2 ring-sky-500' : ''}`}
              >
                <img src={m.poster_path ? `${TMDB_POSTER_BASE}${m.poster_path}` : ''} alt={m.title} className="w-full h-48 object-cover mb-2" />
                <div className="text-sm text-center">{m.title}</div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="font-semibold">Selected Movie</h2>
            {selectedMovie ? (
              <div className="flex items-center gap-4 mt-2">
                <img src={selectedMovie.poster_path ? `${TMDB_POSTER_BASE}${selectedMovie.poster_path}` : ''} alt={selectedMovie.title} className="w-24 h-32 object-cover" />
                <div>
                  <div className="font-bold">{selectedMovie.title}</div>
                  <div className="text-sm text-neutral-500">{selectedMovie.release_date}</div>
                </div>
              </div>
            ) : (
              <p className="text-neutral-500">No movie selected — click a movie above to select</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="font-semibold">Dates & Times</h2>

            <div className="flex gap-2 items-center mt-2">
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="border rounded px-2 py-1" />
              <button type="button" onClick={addDate} className="px-3 py-1 bg-sky-500 text-white rounded">Add date</button>
            </div>

            <div className="mt-4">
              {showsInput.length === 0 && <p className="text-neutral-500">No dates added yet</p>}

              {showsInput.map((entry) => (
                <div key={entry.date} className="border rounded p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold">{entry.date}</div>
                    <div>
                      <button type="button" onClick={() => removeDate(entry.date)} className="text-red-500">Remove date</button>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center mb-2">
                    <input type="time" value={newTimeByDate[entry.date] || ''} onChange={(e) => setNewTimeByDate((p) => ({ ...p, [entry.date]: e.target.value }))} className="border rounded px-2 py-1" />
                    <button type="button" onClick={() => addTimeToDate(entry.date)} className="px-3 py-1 bg-sky-500 text-white rounded">Add time</button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {entry.timings.map((t) => (
                      <div key={t} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                        <span>{t}</span>
                        <button type="button" onClick={() => removeTime(entry.date, t)} className="text-red-500">x</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold">Show Price</h2>
            <input type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} className="border rounded px-2 py-1 mt-2" placeholder="Enter show price" />
          </div>

          <div className="flex gap-3 items-center">
            <button onClick={submitShows} disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">
              {submitting ? 'Submitting...' : 'Create Shows'}
            </button>
            {successMsg && <div className="text-green-600">{successMsg}</div>}
            {error && <div className="text-red-600">{error}</div>}
          </div>
        </>
      )}
    </div>
  )
}

export default AddShows