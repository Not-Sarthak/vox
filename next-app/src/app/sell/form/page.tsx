import React from "react";
import dynamic from 'next/dynamic';
import { Navbar } from "@/components/navbar/navbar";

const DynamicSellForm = dynamic(() => import('./SellFormClient'), { ssr: false });

const SellFormPage: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex justify-center w-full'>
        <div className='w-full max-w-6xl'>
          <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-20'>
            <Navbar />
          </div>
          <div className='pt-16'>
            <div className='px-4 sm:px-8 py-8 pt-14 flex gap-12'>
              <DynamicSellForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellFormPage;