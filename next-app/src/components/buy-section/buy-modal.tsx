import React, { useState } from "react";
import Link from "next/link";
import { useCheckoutStore, generateSlug } from "@/store/store";
import Image from "next/image";
import TransactionWrapper from "../wallet/TransactionWrapper";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { recentlyAdded, sendEmail } from "@/app/_actions";
import { parseEther } from "viem";
import { toast } from "react-toastify";

interface Show {
  date: string;
  day: string;
  time: string;
  price: number;
  currency: string;
}

interface TicketSection {
  section: string;
  row: string;
  view: string;
  remaining: number;
}

interface Event {
  title: string;
  location: string;
  mostSoldTickets: TicketSection[];
}

interface BuyModalProps {
  event: Event;
  show: Show;
  selectedTicket: TicketSection | null;
  onClose: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({
  event,
  show,
  selectedTicket,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCheckout } = useCheckoutStore();

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const { data } = useQuery({
    queryKey: ["recentlyAdded"],
    queryFn: async () => await recentlyAdded(),
  });

  const ticket =
    selectedTicket ||
    event.mostSoldTickets.find((ticket) => ticket.remaining > 0) ||
    event.mostSoldTickets[0];
  const totalPrice = show.price * quantity;

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setStep(2);
    }
  };

  const handleCheckout = () => {
    addToCheckout({
      eventId: 0,
      eventTitle: event.title,
      showDate: show.date,
      showTime: show.time,
      ticketSection: ticket.section,
      ticketRow: ticket.row,
      quantity: quantity,
      totalPrice: totalPrice,
      currency: show.currency,
      email: email,
    });
    onClose();
    console.log("Checkout");
  };

  const searchParams = useSearchParams();

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 font-bricolage'>
      <div className='bg-[#F1F1F1] rounded-lg shadow-xl w-full max-w-md p-3'>
        <div className='bg-white rounded-lg p-4'>
          <div className='flex justify-between items-center'>
            <h2 className='font-bold text-[32px]'>{event.title}</h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <Image src='/buy/cross.svg' alt='cross' width={24} height={24} />
            </button>
          </div>
          <div className=''>
            <p className='text-gray-600 mb-2'>📍 {event.location}</p>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-xl font-semibold'>{show.date}</p>
              <p className='text-gray-600'>
                {show.day}, {show.time}
              </p>
            </div>
            <h3 className='font-semibold mb-2'>Ticket details</h3>
            <div className='bg-[#F7F7F7] p-3 rounded-md mb-4'>
              <div className='flex gap-4 mb-2'>
                <span>Price</span>
                <span className='font-semibold text-green-600'>
                  {show.currency}
                  {totalPrice.toLocaleString()}
                </span>
              </div>
              <div className='flex gap-4 items-center'>
                <span>Qty</span>
                <div className='flex items-center'>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className='px-2 w-6 py-1 bg-gray-200 rounded-l'
                  >
                    -
                  </button>
                  <span className='px-4 py-1 bg-white'>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className='px-2 w-6 py-1 bg-gray-200 rounded-r'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className='mb-2 flex gap-4 items-center'>
              <p className='bg-[#F7F7F7] px-2 py-2 rounded-md'>
                {ticket.section} - {ticket.row}
              </p>
              <p className='bg-[#F7F7F7] px-2 py-2 rounded-md'>{ticket.view}</p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleEmailSubmit} className='mt-4'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md mb-4'
                  required
                />
                <button
                  type='submit'
                  className='w-full bg-black text-white py-3 rounded-md mb-2 hover:bg-opacity-90 transition-all'
                >
                  Continue
                </button>
              </form>
            ) : (
              <div className='flex flex-col gap-2'>
                <TransactionWrapper
                  functionName='buyTicket'
                  args={[data?.[0].eventId, data?.[0].ticketId]}
                  onSuccess={async () => {
                    console.log("Transaction success");
                    toast.success("Ticket purchased successfully");
                    sendEmail(data?.[0].ticketUrl ?? "", email);
                    handleCheckout();
                  }}
                  onError={() => {
                    console.log("Transaction error");
                  }}
                  isApprovalTx={true}
                  approvalAmount={Number(
                    parseEther(data?.[0].price.toString() ?? "500")
                  )}
                  text='Buy Now'
                />
                <Link
                  href={`/buy/bid/${generateSlug(event.title)}`}
                  className='block w-full border border-black text-black py-3 rounded-md mb-2 text-center hover:scale-95 transition-all'
                  onClick={onClose}
                >
                  Place bid
                </Link>
              </div>
            )}
            <p className='text-center text-sm text-[#787878] underline cursor-pointer'>
              See other tickets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
