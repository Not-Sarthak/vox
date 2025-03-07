import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { generateSlug } from "@/store/store";

interface BuyCardProps {
  title: string;
  bgImage: string;
  location: string;
  dateRange: string;
  trending: {
    status: boolean;
    metric: string;
  };
  onClick: (slug: string) => void;
}

const BuyCard: React.FC<BuyCardProps> = ({
  title,
  bgImage,
  location,
  dateRange,
  trending,
  onClick,
}) => {
  const handleClick = () => {
    onClick(generateSlug(title));
  };

  return (
    <button
      onClick={handleClick}
      className='w-full cursor-pointer max-w-sm mx-auto bg-[#F6F6F6] p-3 border-[1px] border-dashed border-[#DADADA] rounded-lg shadow-inner overflow-hidden'
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
            <div className='flex items-center text-[#616161]'>
              <MapPin />
              <span>{location}</span>
            </div>
            <p className='text-[#616161]'>{dateRange}</p>
          </div>
          <div>
            {trending.status && (
              <div className='mt-2'>
                <span className='bg-[#CEFFAD] text-[#44A900] text-xs font-medium px-2.5 py-1 rounded-md border-[#44A900] border-[1px] border-dashed'>
                  Trending event
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default BuyCard;
