import React from "react";

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

function Theater() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Theater Seating Layout
      </h1>

      <div className="max-w-5xl mx-auto bg-neutral-900 p-8 rounded-xl border border-neutral-800">

        {/* SCREEN */}
        <div className="mb-8 text-center">
          <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-2" />
          <p className="text-xs tracking-widest text-neutral-500">
            SCREEN
          </p>
        </div>

        {/* SEATS */}
        <div className="flex justify-center">
          <div className="grid gap-3">
            {seatRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {row.map((seat) => (
                  <button
                    key={seat}
                    disabled
                    className="w-10 h-10 rounded text-xs font-bold
                               bg-neutral-800 text-neutral-300
                               cursor-not-allowed"
                  >
                    {seat}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}

export default Theater;
