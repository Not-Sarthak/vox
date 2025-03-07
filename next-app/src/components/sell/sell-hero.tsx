"use client";

import React from "react";
import { sell } from "../../utils/content";
import SearchBar from "../searchbar/searchbar";
import SellGrid from "./sell-grid";

const SellHero: React.FC = () => {

  return (
    <div className='relative pt-8 w-full flex flex-col'>
      <div className='flex flex-1 justify-center items-center'>
        <div className='flex w-full max-w-xl flex-col items-center gap-3 px-4'>
          <h1 className='text-black text-2xl lg:text-5xl lg:text-nowrap text-center font-semibold font-bricolage leading-tight'>
            {sell.title}
          </h1>
          <p className='text-custom-gray text-center text-xs lg:text-base font-inter leading-tight'>
            {sell.subtitle}
          </p>
        </div>
      </div>
      <div className='w-full max-w-xl mx-auto px-4 mt-10 mb-10'>
        <SearchBar />
      </div>
      <div className='w-full'>
        <SellGrid />
      </div>
    </div>
  );
};

export default SellHero;
