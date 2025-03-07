"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const sliderData = [
  {
    image: "/buy/taylor.png",
    title: "Taylor Swift",
    location: "Bangalore",
    date: "18-21st January 2025",
  },
  {
    image: "/buy/ritviz.png",
    title: "Ritviz",
    location: "Mumbai",
    date: "18-21st July 2025",
  },
  {
    image: "/buy/coldplay.svg",
    title: "Coldplay",
    location: "Delhi",
    date: "18-21st January 2025",
  },
];

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setIsDragging(true);
    if ("touches" in e && e.touches[0]) {
      setStartX(e.touches[0].clientX);
    } else if ("clientX" in e) {
      setStartX(e.clientX);
    }
  };

  const handleDragMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    let currentX: number;
    if ("touches" in e && e.touches[0]) {
      currentX = e.touches[0].clientX;
    } else if ("clientX" in e) {
      currentX = e.clientX;
    } else {
      return;
    }
    const diff = startX - currentX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = window.innerWidth * 0.2; // 20% of screen width
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
        );
      } else {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? sliderData.length - 1 : prevIndex - 1
        );
      }
    }
    setDragOffset(0);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const touchStartHandler = (e: TouchEvent) =>
        handleDragStart(e as unknown as React.TouchEvent<HTMLDivElement>);
      const touchMoveHandler = (e: TouchEvent) =>
        handleDragMove(e as unknown as React.TouchEvent<HTMLDivElement>);
      const touchEndHandler = () => handleDragEnd();

      slider.addEventListener("touchstart", touchStartHandler);
      slider.addEventListener("touchmove", touchMoveHandler);
      slider.addEventListener("touchend", touchEndHandler);

      return () => {
        slider.removeEventListener("touchstart", touchStartHandler);
        slider.removeEventListener("touchmove", touchMoveHandler);
        slider.removeEventListener("touchend", touchEndHandler);
      };
    }
  }, [isDragging]);

  return (
    <div className="relative w-full bg-[#F6F6F6] p-2 sm:p-3 max-w-4xl mx-auto rounded-lg shadow-md border-[1px] border-[#DADADA]">
      <div
        ref={sliderRef}
        className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-out`}
            style={{
              transform: `translateX(${
                (index - currentIndex) * 100 -
                (isDragging && sliderRef.current
                  ? (dragOffset / sliderRef.current.offsetWidth) * 100
                  : 0)
              }%)`,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                layout="fill"
              />
            </div>
            <div className="absolute bottom-0 bg-[#F6F6F6] left-0 right-0">
              <div className="flex justify-between items-start pt-2">
                <div className="flex-grow pr-2">
                  <h2 className="text-lg font-bricolage sm:text-xl text-black truncate">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center mt-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="truncate text-[#616161]">
                      {slide.location} · {slide.date}
                    </span>
                  </p>
                </div>
                <div className="pt-2">
                  <button className="bg-black hover:scale-95 transition-all duration-300 z-10 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium">
                    <Link href="/buy/coldplay">Buy tickets</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-x-2 flex justify-center pt-2 sm:pt-3">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 sm:w-3 h-1 rounded-full ${
              index === currentIndex ? "bg-[#010101]" : "bg-[#DADADA]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
