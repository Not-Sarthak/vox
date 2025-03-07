import React from 'react';
import Image from 'next/image';

interface DescriptionProps {
  title: string;
  location: string;
  dateRange: string;
  isTrending: boolean;
  description: string;
  imageUrl: string;
}

const DescriptionBox: React.FC<DescriptionProps> = ({
  title,
  location,
  dateRange,
  isTrending,
  description,
  imageUrl,
}) => {
  return (
    <div className="max-w-6xl mx-auto bg-[#F6F6F6] border-[1px] border-dashed border-[#DADADA] rounded-lg shadow-md overflow-hidden p-4">
      <div className="md:flex gap-4">
        <div className="md:flex-shrink-0">
          <div className="flex justify-center items-center h-full">
            <Image
              src={imageUrl}
              alt={title}
              className="rounded-md"
              width={420}
              height={220}
            />
          </div>
        </div>
        <div className="">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {isTrending && (
              <div className="mt-2">
                <span className="bg-[#CEFFAD] text-[#44A900] text-xs font-medium px-2.5 py-1 rounded-md border-[#44A900] border-[1px] border-dashed">
                  Trending event
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4">
            <span className="inline-block mr-2">
              <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            {location} · {dateRange}
          </p>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionBox;