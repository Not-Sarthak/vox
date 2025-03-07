"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface SellCardProps {
  title: string;
  bgImage: string;
  location: string;
  dateRange: string;
  trending: {
    status: boolean;
    metric: string;
  };
  onClick: (title: string) => void;
}

const SellCard: React.FC<SellCardProps> = ({
  title,
  bgImage,
  location,
  dateRange,
  trending,
  onClick,
}) => {
  const handleClick = () => {
    onClick(title);
  };

  return (
    <button
      onClick={handleClick}
      className='w-full max-w-sm mx-auto bg-[#F6F6F6] p-3 border-[1px] border-dashed border-[#DADADA] rounded-lg shadow-inner overflow-hidden'
    >
      <div className='relative h-40'>
        <Image
          src={bgImage}
          alt={title}
          layout='fill'
          objectFit='cover'
          className='rounded-t-lg'
        />
      </div>
      <div className='py-3 font-bricolage'>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-2'>
            <div className='text-2xl font-semibold flex justify-start'>
              {title}
            </div>
            <div className='flex items-center text-gray-600'>
              <MapPin />
              <span>{location}</span>
            </div>
            <p className='text-gray-600'>{dateRange}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default SellCard;
