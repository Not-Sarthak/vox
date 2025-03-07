"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar/navbar';
import FullFooterWithBanner from '@/components/footer/full-footer';

const SellConfirmation: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Listing Submitted Successfully!</h1>
        <p className="mb-6">Your ticket has been listed for sale. We'll notify you when it's sold.</p>
        <button 
          onClick={() => router.push('/sell')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          List Another Ticket
        </button>
      </div>
      <FullFooterWithBanner />
    </>
  );
};

export default SellConfirmation;