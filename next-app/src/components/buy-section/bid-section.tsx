import React, { useState } from "react";
import { BuyItem } from "@/store/store";
import { ChevronDown } from "lucide-react";
import BidModal from "./bid-modal";
import TransactionWrapper from "../wallet/TransactionWrapper";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { ConnectWallet, ConnectWalletText } from "@coinbase/onchainkit/wallet";

interface BidSectionProps {
  showId: number;
  ticketId: number;
  shows: BuyItem["shows"];
  selectedShow: BuyItem["shows"][0];
  onShowSelect: (show: BuyItem["shows"][0]) => void;
  bidAmount: string;
  onBidAmountChange: (amount: string) => void;
  onPlaceBid: () => void;
  isLoading: boolean;
  event: {
    title: string;
    location: string;
  };
}

const BidSection: React.FC<BidSectionProps> = ({
  shows,
  showId,
  ticketId,
  selectedShow,
  onShowSelect,
  bidAmount,
  onBidAmountChange,
  onPlaceBid,
  isLoading,
  event,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected } = useAccount();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (show: BuyItem["shows"][0]) => {
    onShowSelect(show);
    setIsOpen(false);
  };

  const incrementBid = () => {
    const newBid = Math.max(parseFloat(bidAmount) + 1, selectedShow.price);
    onBidAmountChange(newBid.toString());
  };

  const decrementBid = () => {
    const newBid = Math.max(parseFloat(bidAmount) - 1, selectedShow.price);
    onBidAmountChange(newBid.toString());
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="pt-10 font-bricolage">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold mb-4 text-2xl">Placing a Bid</h2>
        <div className="relative w-full sm:w-64">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            <span>{selectedShow.date}</span>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              size={20}
            />
          </button>
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {shows.map((show, index) => (
                <div
                  key={index}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(show);
                  }}
                >
                  {show.date} - {show.day} {show.time}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-8">
        <div className="relative">
          <input
            type="text"
            value={`${selectedShow.currency}${parseFloat(
              bidAmount
            ).toLocaleString()}`}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              onBidAmountChange(value);
            }}
            className="w-full border-2 border-gray-300 rounded-md py-2 px-4 text-lg text-[#111111] focus:outline-none focus:border-black"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
            <button
              onClick={incrementBid}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown size={20} className="transform rotate-180" />
            </button>
            <button
              onClick={decrementBid}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
        {isConnected ? (
          <TransactionWrapper
            functionName="placeBid"
            args={[
              showId,
              ticketId,
              parseEther((Number(bidAmount) / 84.06).toFixed(2)),
            ]}
            isApprovalTx={true}
            onSuccess={() => {
              setIsModalOpen(true);
            }}
            onError={() => {
              console.log("Transaction error");
            }}
            approvalAmount={Number(
              parseEther((Number(bidAmount) / 84.06).toFixed(2))
            )}
            text="Place Bid"
          />
        ) : (
          <ConnectWallet className="w-full bg-gradient-to-b from-[#272727] to-black rounded-lg shadow-inner border border-black">
            <ConnectWalletText>Login</ConnectWalletText>
          </ConnectWallet>
        )}
      </div>
      <BidModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        event={event}
        selectedShow={selectedShow}
        bidAmount={bidAmount}
      />
    </div>
  );
};

export default BidSection;