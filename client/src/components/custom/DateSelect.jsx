import React, { useMemo } from 'react';

/**
 * Generates an array of date objects for the next 5 days.
 * @returns {Array<Object>} An array of date info objects.
 */
const getNextFiveDays = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    dates.push({
      // Full date object, used for comparison
      fullDate: date, 
      // e.g., "Today" or "SAT"
      dayLabel: i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      // e.g., "15"
      dateNum: date.getDate(),
    });
  }
  return dates;
};

/**
 * A component to display a horizontal list of the next 5 days for selection.
 * @param {Object} props
 * @param {Date} props.selectedDate - The currently selected Date object.
 * @param {Function} props.onDateSelect - Function to call when a new date is selected.
 */
const DateSelect = ({ selectedDate, onDateSelect }) => {
  // useMemo ensures we only calculate the dates once on component mount
  const dates = useMemo(() => getNextFiveDays(), []);

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold text-white mb-3">Select a Date</h3>
      {/* This container allows horizontal scrolling on small screens
        'flex-nowrap' prevents wrapping
        'overflow-x-auto' adds scrollbar if needed
        'gap-3' adds space between buttons
      */}
      <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2">
        {dates.map((dateInfo) => {
          // Compare dates by converting them to a simple date string (e.g., "Sat Nov 15 2025")
          // This avoids issues with comparing time-of-day.
          const isSelected = selectedDate.toDateString() === dateInfo.fullDate.toDateString();

          return (
            <button
              key={dateInfo.fullDate.toISOString()} // Use a stable, unique key
              onClick={() => onDateSelect(dateInfo.fullDate)}
              type="button"
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg border-2 
                w-20 min-w-[5rem] h-20 
                transition-all duration-200 ease-in-out
                ${
                  isSelected
                    ? 'bg-pink-600 border-pink-500 text-white' // Selected state
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500' // Default state
                }
              `}
            >
              <span className="text-xs font-semibold uppercase">{dateInfo.dayLabel}</span>
              <span className="text-2xl font-bold">{dateInfo.dateNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelect;