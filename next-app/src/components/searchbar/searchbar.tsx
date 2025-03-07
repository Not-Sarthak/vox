import React from "react";
import { Search } from "lucide-react";
import { useBuyStore } from "@/store/store";

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useBuyStore();

  return (
    <div className='w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8'>
      <form className='relative'>
        <div className='relative bg-white p-1 rounded-xl shadow-md'>
          <input
            type='text'
            placeholder='Search for events'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full py-2 sm:py-3 pl-10 sm:pl-12 pr-4 text-custom-gray bg-[#F8F8F8] font-inter border rounded-xl focus:outline-none focus:border-transparent focus:ring-0 text-sm sm:text-base'
          />
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none'>
            <Search className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400' />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
