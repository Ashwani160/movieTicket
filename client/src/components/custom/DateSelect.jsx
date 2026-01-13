import { useEffect } from "react";

const DateSelect = ({ selectedDate, onDateSelect, availableDates = [] }) => {
  const parseDate = (dateStr) => new Date(dateStr + "T00:00:00");

  // Auto-select first available date
  useEffect(() => {
    if (availableDates.length && !selectedDate) {
      onDateSelect(parseDate(availableDates[0]));
    }
  }, [availableDates]);

  return (
    <div className="flex flex-wrap gap-3 my-6">
      {availableDates.map((dateStr) => {
        const dateObj = parseDate(dateStr);
        const isSelected =
          selectedDate?.toDateString() === dateObj.toDateString();

        return (
          <button
            key={dateStr}
            onClick={() => onDateSelect(dateObj)}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                isSelected
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            {dateObj.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </button>
        );
      })}
    </div>
  );
};

export default DateSelect;
