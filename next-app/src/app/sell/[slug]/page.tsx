"use client";

import { useEffect, useState } from "react";
import { useSellStore, SellItem, generateSlug } from "@/store/store";
import { Navbar } from "@/components/navbar/navbar";
import DescriptionBox from "@/components/buy-section/description-box";
import Image from "next/image";
import FullFooterWithBanner from "@/components/footer/full-footer";
import SellSchedule from "@/components/sell/sell-schedule";
import Shimmer from "@/components/loaders/shimmer";

interface SellItemPageProps {
  params: { slug: string };
}

const SellItemPage: React.FC<SellItemPageProps> = ({ params }) => {
  const { items, fetchItems, isLoading, error } = useSellStore();
  const [item, setItem] = useState<SellItem | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      fetchItems();
    }
  }, [fetchItems, items.length]);

  useEffect(() => {
    if (params.slug && items.length > 0) {
      const foundItem = items.find((item) => generateSlug(item.title) === params.slug);
      setItem(foundItem || null);
    }
  }, [params.slug, items]);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Shimmer /></div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  if (!item) return <div className="flex justify-center items-center h-screen">Event not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center w-full">
        <div className="w-full max-w-6xl">
        <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-20'>
            <Navbar />
          </div>
          <div className="px-4 sm:px-8 py-24 flex flex-col gap-4">
            <DescriptionBox
              title={item.title}
              location={item.location}
              dateRange={item.dateRange}
              isTrending={item.trending.status}
              description={item.description}
              imageUrl={item.bgImage}
            />
            <div className="flex flex-col gap-2 pt-6">
              <h2 className="text-2xl font-semibold mb-2 font-bricolage">Sell Tickets for These Shows</h2>
              <SellSchedule event={item} />
            </div>
            <div className="flex flex-col gap-2 pt-6">
              <h2 className="text-2xl font-semibold mb-2 font-bricolage">
                Event Locations
              </h2>
              <Image
                src="/buy/map.svg"
                alt="map"
                width={900}
                height={600}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <FullFooterWithBanner />
    </div>
  );
};

export default SellItemPage;