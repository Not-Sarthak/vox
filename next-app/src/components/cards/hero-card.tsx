"use client";

import React, { useState } from "react";

interface HeroCardProps {
  color: string;
  emoji: string;
  rotation: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({ color, emoji, rotation }) => {
  const [hover, setHover] = useState(false);

  const adjustedRotation = hover
    ? parseInt(rotation) < 0
      ? `${parseInt(rotation) + 3}deg`
      : `${parseInt(rotation) - 3}deg`
    : rotation;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`h-24 cursor-pointer p-2.5 origin-top-left bg-white rounded-lg shadow justify-start items-center gap-2.5 inline-flex transition-transform duration-300 ease-in-out`}
        style={{ transform: `rotate(${adjustedRotation})` }}
      >
        <div
          className="w-20 h-20 text-black text-5xl font-semibold font-bricolage leading-10 flex justify-center items-center"
          style={{ backgroundColor: color }}
        >
          {emoji}
        </div>
      </div>
    </div>
  );
};
