import React from 'react';

const Shimmer: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navbar shimmer */}
        <div className="h-16 bg-gray-200 rounded-lg mb-8 animate-shimmer"></div>

        {/* Hero section shimmer */}
        <div className="h-64 sm:h-80 bg-gray-200 rounded-lg mb-8 animate-shimmer"></div>

        {/* Bid section shimmer */}
        <div className="space-y-4 mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 animate-shimmer"></div>
          <div className="h-12 bg-gray-200 rounded-lg animate-shimmer"></div>
          <div className="h-12 bg-gray-200 rounded-lg animate-shimmer"></div>
        </div>

        {/* Most sold tickets shimmer */}
        <div className="space-y-4 mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-1/4 animate-shimmer"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg animate-shimmer"></div>
            <div className="h-32 bg-gray-200 rounded-lg animate-shimmer"></div>
            <div className="h-32 bg-gray-200 rounded-lg animate-shimmer"></div>
          </div>
        </div>

        {/* Other locations shimmer */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 animate-shimmer"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Shimmer;