import React from 'react';

interface Show {
  date: string;
  day: string;
  time: string;
  price: number;
  currency: string;
  bestSelling?: boolean;
}

interface Event {
  id: number;
  title: string;
  location: string;
  dateRange: string;
  shows: Show[];
}

interface ScheduleProps {
  event: Event;
}

const SellScheduleWithLocation: React.FC<ScheduleProps> = ({ event }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.shows.map((show, index) => (
          <button 
            key={index} 
            className={`p-4 rounded-lg flex flex-col justify-center items-center ${
              show.bestSelling 
                ? 'bg-green-100 border-[10px] border-green-300 relative' 
                : 'bg-white border-gray-200 border-[10px]'
            }`}
          >
            {show.bestSelling && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -rotate-6 bg-[#CEFFAD] text-green-500 text-xs py-1 px-2 rounded-full shadow-md">
                Best selling tickets
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{show.date}</h3>
            <p className="text-gray-600 mb-2">{show.day} {show.time}</p>
            <div className="flex items-center text-gray-500 mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
            <p className="text-lg font-semibold text-green-600">{show.currency}{show.price.toLocaleString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SellScheduleWithLocation;