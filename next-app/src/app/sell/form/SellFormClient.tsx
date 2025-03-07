// SellFormClient.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSellFormStore, TicketType, SplitPreference } from "@/store/store";
import { useAccount } from "wagmi";
import { ConnectWallet, ConnectWalletText } from "@coinbase/onchainkit/wallet";
import TransactionWrapper from "@/components/wallet/TransactionWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { MapIcon } from "lucide-react";
import { parseEther } from "viem";
import lighthouse from "@lighthouse-web3/sdk";
import { toast } from "react-toastify";

const SellFormClient: React.FC = () => {
  const {
    ticketType,
    numberOfTickets,
    splitPreference,
    section,
    row,
    fromSeat,
    toSeat,
    price,
    useSlippage,
    slippagePercentage,
    errors,
    setField,
    validateForm,
    setUploadedFile,
  } = useSellFormStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { address } = useAccount();
  const searchParams = useSearchParams();

  const [eventDetails, setEventDetails] = useState({
    eventId: "",
    title: "",
    location: "",
    date: "",
    day: "",
    time: "",
    price: 0,
    currency: "",
  });

  useEffect(() => {
    const eventId = searchParams.get("eventId") || "";
    const eventName = searchParams.get("eventName") || "";
    const eventLocation = searchParams.get("eventLocation") || "";
    const showDate = searchParams.get("showDate") || "";
    const showTime = searchParams.get("showTime") || "";
    const showPrice = searchParams.get("showPrice") || "0";
    const showCurrency = searchParams.get("showCurrency") || "";

    const date = new Date(showDate);
    const day = date.toLocaleString("en-us", { weekday: "long" });

    setEventDetails({
      eventId,
      title: decodeURIComponent(eventName),
      location: decodeURIComponent(eventLocation),
      date: showDate,
      day,
      time: showTime,
      price: parseInt(showPrice),
      currency: decodeURIComponent(showCurrency),
    });

    setField("price", parseInt(showPrice));
  }, [searchParams, setField]);

  const ticketTypes: TicketType[] = [
    "Paper",
    "E-Ticket",
    "Mobile QR Code",
    "Mobile Ticket Transfer",
  ];
  const splitPreferences: SplitPreference[] = [
    "No preference",
    "Avoid leaving 1 ticket",
    "Sell together",
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file: File = e.target.files[0];
    setSelectedFile(file);

    const output = await lighthouse.upload(
      e.target.files,
      process.env.NEXT_PUBLIC_LH_API_KEY!
    );

    const cid = `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;
    console.log("cid", cid);
    setTicketUrl(cid);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      console.log("Form is valid, proceed with submission");
    } else {
      console.log("Form validation failed");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='w-2/3 space-y-6'>
        <div className='bg-[#F7F7F7] p-2 rounded text-sm text-gray-600 border-[#D6D6D6] border-[1.5px] border-dashed'>
          NOTE: You can edit your tickets later!
        </div>

        <div>
          <div className='text-black text-2xl font-semibold font-bricolage leading-[28.80px]'>
            Choose ticket type
          </div>
          <div className='flex flex-wrap gap-4 pt-2'>
            {ticketTypes.map((type) => (
              <button
                key={type}
                type='button'
                onClick={() => setField("ticketType", type)}
                className={`h-[50px] px-6 py-2 rounded-lg ${
                  ticketType === type
                    ? "bg-[#cdffac] border-[1px] border-[#43a900] text-black"
                    : "bg-[#f6f6f6] text-gray-800 border-[#D6D6D6] border-[1.5px] border-dashed"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {(ticketType === "E-Ticket" || ticketType === "Mobile QR Code") && (
            <div className='mt-4'>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileUpload}
                className='hidden'
                accept='image/*,.pdf'
              />
              <button
                type='button'
                onClick={handleUploadClick}
                className='w-full py-2 px-4 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors duration-200'
              >
                {selectedFile
                  ? `Uploaded: ${selectedFile.name}`
                  : "Upload your ticket"}
              </button>
              {errors.uploadedFile && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.uploadedFile}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <div className='text-black text-2xl font-semibold font-bricolage leading-[28.80px]'>
            Number of tickets
          </div>
          <div className='flex flex-wrap gap-3 pt-2'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type='button'
                onClick={() => setField("numberOfTickets", num)}
                className={`py-2 px-4 rounded-lg w-14 ${
                  numberOfTickets === num
                    ? "bg-[#cdffac] border-[1px] border-[#43a900] text-black"
                    : "bg-[#f6f6f6] text-gray-800 border-[#D6D6D6] border-[1.5px] border-dashed"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className='text-black text-2xl font-semibold font-bricolage leading-[28.80px]'>
            How do you want to split your tickets?
          </div>
          <div className='flex flex-wrap gap-2 pt-2'>
            {splitPreferences.map((pref) => (
              <button
                key={pref}
                type='button'
                onClick={() => setField("splitPreference", pref)}
                className={`py-2 px-4 rounded-lg ${
                  splitPreference === pref
                    ? "bg-[#cdffac] border-[1px] border-[#43a900] text-black"
                    : "bg-[#f6f6f6] text-gray-800 border-[#D6D6D6] border-[1.5px] border-dashed"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className='text-black text-2xl font-semibold font-bricolage leading-[28.80px] pb-2'>
            Entering seating details
          </div>
          <div className='space-y-2 bg-[#f6f6f6] rounded-lg p-4 border-[#D6D6D6] border-[1.5px] border-dashed'>
            <select
              value={section}
              onChange={(e) => setField("section", e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option value=''>Section</option>
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
              <option value='E'>E</option>
            </select>
            {errors.section && (
              <p className='text-red-500 text-sm'>{errors.section}</p>
            )}

            <select
              value={row}
              onChange={(e) => setField("row", e.target.value)}
              className='w-full p-2 border rounded'
            >
              <option value=''>Row</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
            </select>
            {errors.row && <p className='text-red-500 text-sm'>{errors.row}</p>}

            <div className='flex space-x-2'>
              <input
                type='text'
                value={fromSeat}
                onChange={(e) => setField("fromSeat", e.target.value)}
                placeholder='From: Seat number'
                className='w-1/2 p-2 border rounded'
              />
              <input
                type='text'
                value={toSeat}
                onChange={(e) => setField("toSeat", e.target.value)}
                placeholder='To: Seat number'
                className='w-1/2 p-2 border rounded'
                disabled={numberOfTickets === 1}
              />
            </div>
            {errors.fromSeat && (
              <p className='text-red-500 text-sm'>{errors.fromSeat}</p>
            )}
            {errors.toSeat && (
              <p className='text-red-500 text-sm'>{errors.toSeat}</p>
            )}
          </div>
        </div>

        <div>
          <div className='text-black text-2xl font-semibold font-bricolage leading-[28.80px]'>
            Select your price
          </div>
          <p className='text-sm text-gray-600 pb-2'>
            You can only list your tickets for up to 2x the original price.
          </p>
          <div className='space-y-2 bg-[#f6f6f6] rounded-lg p-4 border-[#D6D6D6] border-[1.5px] border-dashed'>
            <input
              type='number'
              value={price}
              onChange={(e) => setField("price", Number(e.target.value))}
              className='w-full p-2 border rounded'
            />
          </div>
          {errors.price && (
            <p className='text-red-500 text-sm'>{errors.price}</p>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={useSlippage}
            onChange={(e) => setField("useSlippage", e.target.checked)}
            id='useSlippage'
            className='form-checkbox h-4 w-4 text-blue-600'
          />
          <label htmlFor='useSlippage' className='text-sm text-gray-600'>
            Would you like to sell with a slippage percentage? This has a higher
            chance of being sold.
          </label>
        </div>

        {useSlippage && (
          <div className='flex items-center gap-2 bg-[#f6f6f6] rounded-lg p-4 border-[#D6D6D6] border-[1.5px] border-dashed'>
            <input
              type='number'
              value={slippagePercentage}
              onChange={(e) =>
                setField("slippagePercentage", Number(e.target.value))
              }
              placeholder='Enter slippage percentage'
              className='w-2/3 p-2 border rounded'
            />
            <button
              type='button'
              onClick={() => console.log("Slippage saved")}
              className='w-1/3 bg-black text-white p-2 rounded'
            >
              Save slippage
            </button>
          </div>
        )}
        {errors.slippagePercentage && (
          <p className='text-red-500 text-sm'>{errors.slippagePercentage}</p>
        )}

        {!address ? (
          <ConnectWallet className='w-full'>
            <ConnectWalletText>Sign In to List</ConnectWalletText>
          </ConnectWallet>
        ) : (
          <TransactionWrapper
            functionName='listTicket'
            args={[
              Number(eventDetails.eventId),
              fromSeat,
              Number(parseEther(price.toString())) / 84.06,
            ]}
            isApprovalTx={false}
            onSuccess={async () => {
              router.push(`/sell/${eventDetails.title.toLowerCase()}`);
              toast.success("Ticket listed successfully");
            }}
            onError={() => {
              console.log("Transaction error");
            }}
            text='Next: Payment Details'
          />
        )}
      </form>
      <div className='w-1/3 font-bricolage'>
        <div className='p-4'>
          <div className='flex pb-4 justify-between items-center'>
            <h2 className='text-[32px] font-semibold'>{eventDetails.title}</h2>{" "}
            <div className='flex items-center gap-2'>
              <MapIcon />
              <span className='text-gray-500'>{eventDetails.location}</span>
            </div>
          </div>
          <div className='relative mb-4'>
            <div className='absolute -top-3 -rotate-6 left-1/2 transform -translate-x-1/2 bg-[#CEFFAD] text-green-600 px-2 py-0.5 rounded-md text-sm border-green-600 border-dashed border-[1px]'>
              Trending event
            </div>
            <div className='bg-gray-100 p-4 h-[179px] rounded-lg'>
              <div className='bg-white h-full flex justify-center items-center flex-col'>
                <p className='text-xl font-semibold mb-1'>
                  {eventDetails.date}
                </p>
                <p className='text-md text-[#111111]'>{`${eventDetails.day}  ${eventDetails.time}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellFormClient;
