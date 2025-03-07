"use client";

import { useEffect, useState } from "react";
import { useBuyStore, BuyItem, generateSlug } from "@/store/store";
import { useBidStore } from "@/store/store";
import DescriptionBox from "@/components/buy-section/description-box";
import { Navbar } from "@/components/navbar/navbar";
import Schedule from "@/components/buy-section/schedule";
import MostSoldTickets from "@/components/buy-section/most-sold-tickets";
import Image from "next/image";
import FullFooterWithBanner from "@/components/footer/full-footer";
import BuyModal from "@/components/buy-section/buy-modal";
import { useQuery } from "@tanstack/react-query";
import { getShows } from "@/app/_actions";
import Shimmer from "@/components/loaders/shimmer";

const BuyItemPage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { currentBid } = useBidStore();
  const [item, setItem] = useState<BuyItem | null>(null);
  const { items, setItems } = useBuyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<BuyItem["shows"][0] | null>(
    null
  );
  const [selectedTicket, setSelectedTicket] = useState<
    BuyItem["mostSoldTickets"][0] | null
  >(null);

  useEffect(() => {
    if (items) {
      const getData = async () => {
        const shows = await getShows();
        setItems(shows);
      };
      getData();
    }
  }, []);

  useEffect(() => {
    if (params.slug && items && items.length > 0) {
      const foundItem = items.find(
        (item) => generateSlug(item.title) === params.slug
      );
      setItem(foundItem || null);
    }
  }, [params.slug, items]);

  const handleTicketSelect = (ticket: BuyItem["mostSoldTickets"][0]) => {
    setSelectedTicket(ticket);
    setSelectedShow(item?.shows[0] || null);
    setIsModalOpen(true);
  };

  if (!item) return <div><Shimmer /></div>;

  return (
    <>
      <div className='container mx-auto max-w-6xl px-2 lg:px-8 py-8 flex flex-col gap-4 border-x-2 min-h-screen'>
        <Navbar />
        <DescriptionBox
          title={item.title}
          location={item.location}
          dateRange={item.dateRange}
          isTrending={item.trending.status}
          description={item.description}
          imageUrl={item.bgImage}
        />
        {currentBid && (
          <div className='bg-blue-100 p-4 rounded-lg mb-4'>
            <p className='text-blue-800 font-semibold'>
              Your current bid: {item.shows[0].currency}
              {currentBid}
            </p>
          </div>
        )}
        <div className='flex flex-col gap-2 pt-6'>
          <h2 className='text-2xl font-semibold mb-2 font-bricolage'>
            Choose a Show
          </h2>
          <Schedule event={item} />
        </div>
        <div className='flex flex-col gap-2 pt-6'>
          <h2 className='text-2xl font-semibold mb-2 font-bricolage'>
            Most sold tickets
          </h2>
          <MostSoldTickets
            tickets={item.mostSoldTickets}
            onTicketSelect={handleTicketSelect}
          />
        </div>
        <div className='flex flex-col gap-2 pt-6'>
          <h2 className='text-2xl font-semibold mb-2 font-bricolage'>
            Other locations around the world
          </h2>
          <Image
            src='/buy/map.svg'
            alt='map'
            width={900}
            height={600}
            className='flex justify-center w-full'
          />
        </div>
      </div>
      <div>
        <FullFooterWithBanner />
      </div>
      {isModalOpen && item && (selectedShow || selectedTicket) && (
        <BuyModal
          event={{
            title: item.title,
            location: item.location,
            mostSoldTickets: item.mostSoldTickets,
          }}
          show={selectedShow || item.shows[0]}
          selectedTicket={selectedTicket}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default BuyItemPage;
