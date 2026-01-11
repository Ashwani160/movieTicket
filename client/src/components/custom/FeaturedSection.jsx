import React from 'react';
import { Button } from '../ui/button';
import ThreeDCardDemo from '../aceternity/3dCard';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext.jsx';

const FeaturedSection = () => {
  const { shows } = useAppContext();
  const navigate = useNavigate();

  return (
    <section className="mt-10 px-4">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Now Showing
        </h2>
        <Button
          onClick={() => navigate('/movies')}
          className="bg-primary-500 text-black hover:bg-primary-dull"
        >
          Show all
        </Button>
      </div>

      {/* ===== Cards ===== */}
      <div className="flex flex-wrap justify-center gap-8">
        {shows.length === 0 ? (
          <p className="text-gray-400">No shows available</p>
        ) : (
          shows.slice(0, 4).map((movie) => (
            <ThreeDCardDemo key={movie._id} movie={movie} />
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
  