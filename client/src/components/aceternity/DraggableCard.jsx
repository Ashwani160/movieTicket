import React, { useRef } from "react"; // Ensure useRef is imported
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

// A small pixel threshold to differentiate a click from a drag
const DRAG_CLICK_THRESHOLD = 10; // 10 pixels

export function DraggableCardDemo({ videos = [], onSelect = () => {}, currentTrailerId }) {
  // --- NEW ---
  // This ref will store the (x, y) coordinates of where the pointer went down.
  const pointerDownPos = useRef(null);

  const positions = [
    "absolute top-8 left-6",
    "absolute top-16 left-1/4",
    "absolute top-6 left-1/2",
    "absolute top-24 right-1/4",
    "absolute top-12 right-6",
    "absolute top-20 left-1/3",
    "absolute top-4 right-1/3",
  ];

  const items = videos.length
    ? videos.map((v, i) => ({
        _id: v._id || i,
        title: v.title || v.name || `Trailer ${i + 1}`,
        image: v.image,
        videoUrl: v.videoUrl || v.url,
        className: positions[i % positions.length] + " w-80",
        raw: v,
      }))
    : [
        {
          _id: "fallback",
          title: "Fallback",
          image:
            "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto.format&fit=crop",
          className: "absolute top-10 left-[20%] rotate-[-5deg] w-80",
          raw: {},
        },
      ];

  return (
    <DraggableCardContainer className="relative flex min-h-96 w-full items-center justify-center overflow-clip">
      <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
        Select a trailer to play
      </p>

      {items.map((item) => (
        <DraggableCardBody
          key={item._id}
          className={item.className}
          // We no longer need onDragStart or onDragEnd for this logic
        >
          <div
            className="relative w-full h-80 cursor-pointer"
            
            // --- NEW LOGIC ---
            // 1. When the pointer goes down, record its start position.
            onPointerDown={(e) => {
              pointerDownPos.current = { x: e.clientX, y: e.clientY };
            }}
            
            // 2. When the pointer comes up, compare its end position to the start.
            // We use onPointerUp instead of onClick.
            onPointerUp={(e) => {
              // If we don't have a start position, do nothing.
              if (!pointerDownPos.current) {
                return;
              }

              // Calculate the distance moved
              const deltaX = Math.abs(e.clientX - pointerDownPos.current.x);
              const deltaY = Math.abs(e.clientY - pointerDownPos.current.y);
              
              // Reset the start position for the next interaction
              pointerDownPos.current = null;

              // 3. Only if the pointer moved *less* than the threshold,
              // treat it as a click.
              if (deltaX < DRAG_CLICK_THRESHOLD && deltaY < DRAG_CLICK_THRESHOLD) {
                onSelect(item.raw);
              }
            }}
            
            // We've replaced onClick, so it's removed from here.
          >
            <img
              src={item.image}
              alt={item.title}
              className="pointer-events-none relative z-10 h-80 w-full object-cover"
            />
            
            <div
              className={
                "pointer-events-none absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white transition-opacity " +
                (currentTrailerId === item._id ? "ring-4 ring-sky-400" : "hover:opacity-90")
              }
              aria-hidden="true"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            >
              <span className="ml-1 text-lg font-black">►</span>
            </div>
          </div>

          <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
            {item.title}
          </h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}