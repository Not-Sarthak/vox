"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar/navbar";
import FullFooterWithBanner from "@/components/footer/full-footer";
import { HeroCard } from "@/components/cards/hero-card";
import { DotPattern } from "@/components/background/dot-pattern";

const NotFound: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white font-bricolage">
      <div className='absolute inset-0 -z-5'>
            <DotPattern className='[mask-image:gradient(1px_circle_at_center,white,transparent)]' />
          </div>
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-6xl">
          <Navbar />
        </div>

        <main className="flex-grow pt-24 flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mb-8 leading-tight">
              Hey, this page is <span className="font-semibold">missing</span>.
              <span className="block mt-2">
                Try home, explore, or view your profile.
              </span>
            </h1>

            <div className="flex items-center gap-8 w-full justify-center">
              <div className="">
                <HeroCard color="#CDFFAC" emoji="🎤" rotation="4deg" />
              </div>
              <div className="">
                <HeroCard color="#ADE8FF" emoji="🎺" rotation="-2deg" />
              </div>
              <div className="">
                <HeroCard color="#E1CCFF" emoji="🪩" rotation="4deg" />
              </div>
              <div className="">
                <HeroCard color="#FFE0A6" emoji="🎶" rotation="-2deg" />
              </div>
            </div>
            <p className="mt-8 text-xl sm:text-2xl text-gray-600">
              {"{aka 404}"}
            </p>
          </div>
        </main>
        <div className="z-10">
        <FullFooterWithBanner />
        </div>
      </div>
    </>
  );
};

export default NotFound;
