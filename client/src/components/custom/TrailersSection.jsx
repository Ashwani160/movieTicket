import React, { useEffect, useRef, useState } from 'react'
import { dummyTrailers } from '@/assets/assets.js';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { DraggableCardDemo } from '../aceternity/DraggableCard';

const TrailersSection = () => {
  const url = import.meta.env.VITE_API_URL;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTrailer, setCurrentTrailer] = useState(null);

  async function getTrailers() {
    try {
      if (!url) {
        console.warn('VITE_API_URL is not set');
        setVideos(dummyTrailers);
        setCurrentTrailer(dummyTrailers[0] || null);
        return;
      }

      const res = await axios.get(`${url.replace(/\/$/, '')}/trailers/allTrailers`);
      const raw = res.data?.data || [];

      // normalize incoming shape to { _id, image, videoUrl }
      const normalized = raw.map((v, i) => ({
        _id: v._id || v.id || i,
        image: v.image || v.thumbnail || v.poster || v.img || null,
        videoUrl: v.videoUrl || v.video_url || v.url || v.video || v.source || null,
        raw: v,
      }));

      console.log('fetched trailers (normalized):', normalized);

      // prefer items that actually have videoUrl
      const withUrl = normalized.filter((x) => !!x.videoUrl);
      const finalList = withUrl.length ? withUrl : normalized;

      if (finalList.length === 0) {
        setVideos(dummyTrailers);
        setCurrentTrailer(dummyTrailers[0] || null);
      } else {
        setVideos(finalList);
        setCurrentTrailer(finalList[0]);
      }
    } catch (err) {
      console.error('Error fetching trailers:', err?.message || err);
      setVideos(dummyTrailers);
      setCurrentTrailer(dummyTrailers[0] || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTrailers();
  }, [url]);

  // debug: show which URL will be played
  useEffect(() => {
    if (currentTrailer) {
      console.log('ReactPlayer will play:', currentTrailer.videoUrl || currentTrailer.url);
    }
  }, [currentTrailer]);

  return (
    <div className="my-6">
      {loading ? (
        <p>loading...</p>
      ) : (
        <>
          {/* --- STYLED VIDEO PLAYER SECTION --- */}
          <div className="w-full max-w-4xl mx-auto mb-12">
            {/* This wrapper creates the responsive 16:9 aspect ratio box.
              It's styled with a dark background, rounded corners, a shadow,
              and overflow-hidden to clip the player to its shape.
            */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-neutral-900">
              {currentTrailer ? (
                <ReactPlayer
                  src={currentTrailer.videoUrl || currentTrailer.url}
                  controls
                  width="100%"
                  height="100%"
                  // This style makes the player fill the relative parent
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              ) : (
                // --- STYLED EMPTY STATE ---
                // This now sits inside the player box
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <p className="text-neutral-500 text-lg font-medium">
                    Select a trailer to play
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* --- END VIDEO PLAYER SECTION --- */}

          <div className="mt-6">
            <DraggableCardDemo
              videos={videos}
              onSelect={(video) => setCurrentTrailer(video)}
              currentTrailerId={currentTrailer?._id}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TrailersSection;