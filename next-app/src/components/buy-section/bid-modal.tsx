import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { BuyItem } from "@/store/store";
import Image from "next/image";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    location: string;
  };
  selectedShow: BuyItem["shows"][0];
  bidAmount: string;
}

const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  event,
  selectedShow,
  bidAmount,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleXClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 font-bricolage"
      onClick={handleBackgroundClick}
    >
      <div 
        className="bg-[#f0f0f0] rounded-lg shadow-xl w-full max-w-md p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-b from-[#ffefac] to-white p-4 py-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <p className="text-custom-gray">📍 {event.location}</p>
            </div>
            <button
              onClick={handleXClick}
              className="text-gray-500 hover:text-gray-700 border-[1px] border-gray-500 rounded-lg p-1"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-center items-center">
              <Image
                src="/buy/yellow-check.svg"
                alt="yellow"
                width={70}
                height={70}
              />
            </div>
            <div>
              <p className="text-center text-xl font-semibold mb-2 text-[#111111]">
                Bid placed successfully!
              </p>
              <p className="text-center text-[#111111]">
                Let the seller get back to you. You can track your bids on your{" "}
                <span className="underline">profile</span>.
              </p>
            </div>
          </div>
          <div className="bg-[#f6f6f6] border-[1px] border-dashed border-[#d6d6d6] text-custom-gray rounded-lg overflow-hidden mt-4">
            <button
              className="w-full p-4 flex justify-between items-center font-semibold"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              <span>Ticket details</span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  isAccordionOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isAccordionOpen ? "max-h-48" : "max-h-0"
              }`}
            >
              <div className="p-4">
                <p>
                  {selectedShow.date} - {selectedShow.day}, {selectedShow.time}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span>Your Bid</span>
                  <span className="text-green-600">
                    {selectedShow.currency}
                    {parseFloat(bidAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Req. price</span>
                  <span className="">
                    {selectedShow.currency}
                    {selectedShow.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleCloseClick}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;