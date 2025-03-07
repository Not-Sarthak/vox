"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import exploreData from "../../utils/explore";

type TabOption = "All Events" | "Sports" | "Theatre" | "Festivals";

interface Event {
  id: number;
  title: string;
  bgImage: string;
  category?: string;
}

const Tab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabOption>("All Events");

  const tabs: TabOption[] = ["All Events", "Sports", "Theatre", "Festivals"];

  const filteredData =
    selectedTab === "All Events"
      ? exploreData
      : exploreData.filter((event) => event.category === selectedTab);

  const renderContent = () => {
    if (filteredData.length === 0) {
      return (
        <p className="text-center text-gray-500 mt-8">
          No events found for {selectedTab}.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.map((event: Event) => (
          <div
            key={event.id}
            className="relative cursor-pointer rounded-lg overflow-hidden aspect-square"
          >
            <Image
              src={event.bgImage}
              alt={event.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="text-xl font-semibold font-bricolage">
                {event.title}
              </h3>
              {event.category && (
                <p className="text-sm mt-1 bg-white/20 px-2 py-1 rounded-full inline-block">
                  {event.category}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full px-4 border-t-2 border-t-black/10 pt-10 sm:px-6 lg:px-8">
      <div className="hidden sm:flex flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex flex-col sm:flex-row space-x-0 space-y-2 sm:space-y-0 sm:space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-left sm:text-center ${
                selectedTab === tab
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="mt-4 sm:mt-0 flex items-center text-gray-500 gap-2 bg-[#F8F8F8] py-2 px-4 rounded-full shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
            <Image
              src="/explore/filter.svg"
              alt="filter"
              width={16}
              height={16}
            />
            Filter
          </button>
          <button className="mt-4 sm:mt-0 flex items-center text-white gap-2 bg-[#111111] py-2 px-4 rounded-full shadow-sm border border-gray-200 hover:bg-[#000000] hover:scale-95 duration-200">
          <Image
              src="/explore/profile.svg"
              alt="filter"
              width={16}
              height={16}
            />
            Profile
          </button>
        </div>
      </div>

      <div className="sm:hidden relative mb-6">
        <select
          className="w-full py-2 pl-4 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black appearance-none transition duration-150 ease-in-out"
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value as TabOption)}
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab} className="text-gray-700">
              {tab}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-500" />
      </div>

      <div className="mt-6">{renderContent()}</div>
    </div>
  );
};

export default Tab;
