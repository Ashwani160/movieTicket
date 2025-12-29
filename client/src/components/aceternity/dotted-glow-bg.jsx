import React from "react";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";

export default function DottedGlowBackgroundDemo({ children }) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden
                 rounded-3xl border border-transparent shadow ring-1 
                 shadow-black/10 ring-black/5 
                 dark:shadow-white/10 dark:ring-white/5
                 w-60 h-60 md:w-80 md:h-80"
    >
      {/* Dotted animated background */}
      <DottedGlowBackground
        className="absolute inset-0 pointer-events-none mask-radial-to-90% mask-radial-at-center"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />

      {/* Foreground content */}
      <div className="relative z-20 text-center backdrop-blur-[2px] p-4">
        {children}
      </div>
    </div>
  );
}
