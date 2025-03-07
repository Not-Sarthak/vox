"use client";

import React from "react";
import Link from "next/link";

const EventBanner = () => (
  <div className='bg-gradient-to-b from-[#272727] to-black text-white py-4 px-4 text-center w-72 rounded-t-lg shadow-md'>
    <p className='text-sm font-medium'>You'll never miss an event again!</p>
  </div>
);

const FullFooter = () => (
  <footer className='pt-10'>
    <div className='mx-auto'>
      <div className='flex justify-center'>
        <EventBanner />
      </div>
      <div className='py-8 px-8 bg-[#F8F8F8]'>
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center'>
          <nav className='lg:hidden flex flex-row space-x-4 items-start py-4 mb-4 border-b-2 border-dashed w-full'>
            <Link
              href='/buy'
              className='text-gray-600 hover:text-gray-900 hover:underline'
            >
              Buy
            </Link>
            <Link
              href='/sell'
              className='text-gray-600 hover:text-gray-900 hover:underline'
            >
              Sell
            </Link>
            <Link
              href='/explore'
              className='text-gray-600 hover:text-gray-900 hover:underline'
            >
              Explore
            </Link>
          </nav>
          <div className='mb-6 lg:mb-0 max-w-md flex flex-col gap-6 lg:gap-12'>
            <h2 className='text-2xl font-semibold font-bricolage flex items-center'>
              🎤 Vox
            </h2>
            <p className='mt-2 w-[20rem] text-gray-600 font-bricolage'>
              A based user-friendly and trustless reselling Marketplace for
              normies
            </p>
            <p className='mt-2 text-gray-400 text-sm'>
              made by{" "}
              <a href='https://x.com/vrajdesai78' className='underline'>
                vraj
              </a>
              ,{" "}
              <a href='https://x.com/0xSarthak13' className='underline'>
                sarthak
              </a>
              ,{" "}
              <a href='https://x.com/farhatkadiwala_' className='underline'>
                farhat
              </a>
            </p>
          </div>
          <nav className='hidden lg:flex flex-col space-y-4 items-start'>
            <Link
              href='/buy'
              className='text-gray-600 hover:text-gray-900 hover:underline'
            >
              Buy
            </Link>
            <Link
              href='/sell'
              className='text-gray-600 hover:text-gray-900 hover:underline'
            >
              Sell
            </Link>
            <Link
              href='/profile'
              className='text-gray-600 hover:text-gray-900 hover:underline'
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </div>
  </footer>
);

const FullFooterWithBanner: React.FC = () => (
  <div className='mt-auto'>
    <FullFooter />
  </div>
);

export default FullFooterWithBanner;
