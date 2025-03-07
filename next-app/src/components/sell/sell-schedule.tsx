import React from "react";
import { useRouter } from "next/navigation";

interface Show {
  id: number;
  date: string;
  day: string;
  time: string;
  price: number;
  currency: string;
  bestSelling?: boolean;
}

interface Event {
  title: string;
  location: string;
  dateRange: string;
  shows: Show[];
}

interface ScheduleProps {
  event: Event;
}

const SellSchedule: React.FC<ScheduleProps> = ({ event }) => {
  const router = useRouter();

  const handleShowSelect = (show: Show) => {
    const queryParams = new URLSearchParams({
      eventId: show.id.toString(),
      eventName: encodeURIComponent(event.title),
      eventLocation: encodeURIComponent(event.location),
      showDate: show.date,
      showTime: show.time,
      showPrice: show.price.toString(),
      showCurrency: show.currency,
    }).toString();

    router.push(`/sell/form?${queryParams}`);
  };

  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {event.shows.map((show, index) => (
          <button
            key={index}
            className={`p-4 rounded-lg flex flex-col justify-center items-center ${
              show.bestSelling
                ? "bg-green-100 border-[10px] border-green-300 relative"
                : "bg-white border-gray-200 border-[10px]"
            }`}
            onClick={() => handleShowSelect(show)}
          >
            {show.bestSelling && (
              <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 -rotate-6 bg-[#CEFFAD] text-green-500 text-xs py-1 px-2 rounded-full shadow-md'>
                Best selling tickets
              </div>
            )}
            <h3 className='text-xl font-bold mb-2'>{show.date}</h3>
            <p className='text-gray-600 mb-4'>
              {show.day} {show.time}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SellSchedule;
