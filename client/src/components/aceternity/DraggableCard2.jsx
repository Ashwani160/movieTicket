import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function DraggableCardDemo({videos=[] , onclick=()=>{}}) {
  const items = videos;
  console.log(items)
  return (
    <DraggableCardContainer
    className="relative flex min-h-150 w-full items-center justify-center overflow-clip">
      <p
        className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
        If its your first day at Fight Club, you have to fight.
      </p>
      {items.map((item) => (
        <DraggableCardBody className={item.className}
        key={item.image}
        >
          <div
            onClick={()=>onclick(item)}
          >
          <img
            src={item.image}
            alt={item.title}
            className="pointer-events-none relative z-10 h-80 w-80 object-cover" />
          
          </div>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
