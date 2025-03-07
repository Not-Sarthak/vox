"use client";

import { useEffect, useState } from "react";
import { useBuyStore, useBidStore, BuyItem, generateSlug } from "@/store/store";
import { Navbar } from "@/components/navbar/navbar";
import DescriptionBox from "@/components/buy-section/description-box";
import BidSection from "@/components/buy-section/bid-section";
import MostSoldTickets from "@/components/buy-section/most-sold-tickets";
import FullFooterWithBanner from "@/components/footer/full-footer";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Shimmer from "@/components/loaders/shimmer";

const BidPage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const router = useRouter();
  const { slug } = params;
  const { items, fetchConcerts } = useBuyStore();
  const [item, setItem] = useState<BuyItem | null>(null);
  const [selectedShow, setSelectedShow] = useState<BuyItem["shows"][0] | null>(
    null
  );
  const [bidAmount, setBidAmount] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const showId = searchParams.get("showId");
  const ticketId = searchParams.get("ticketId");

  useEffect(() => {
    if (items.length === 0) {
      fetchConcerts();
    }
  }, [fetchConcerts, items.length]);

  useEffect(() => {
    if (slug && items.length > 0) {
      const foundItem = items.find((item) => generateSlug(item.title) === slug);
      setItem(foundItem || null);
      setSelectedShow(foundItem?.shows[0] || null);
      setBidAmount(foundItem?.shows[0].price.toString() || "");
    }
  }, [slug, items]);

  const handleShowSelect = (show: BuyItem["shows"][0]) => {
    setSelectedShow(show);
    setBidAmount(show.price.toString());
  };

  const handleBidAmountChange = (amount: string) => {
    setBidAmount(amount);
  };

  const handlePlaceBid = async () => {
    if (!item || !selectedShow) return;
    setIsLoading(true);
    try {
      // Simulating bid placement
      console.log("Bid placed:", {
        event: {
          title: item.title,
          location: item.location,
        },
        selectedShow: selectedShow,
        bidAmount: bidAmount,
      });

      // You might want to add actual bid placement logic here
      // For now, we'll just redirect after a short delay
      setTimeout(() => {
        router.push(`/buy/${generateSlug(item.title)}`);
      }, 2000);
    } catch (error) {
      console.error("Failed to place bid:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!item || !selectedShow) return <div><Shimmer /></div>;

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
        <BidSection
          shows={item.shows}
          selectedShow={selectedShow}
          onShowSelect={handleShowSelect}
          bidAmount={bidAmount}
          onBidAmountChange={handleBidAmountChange}
          onPlaceBid={handlePlaceBid}
          isLoading={isLoading}
          event={{
            title: item.title,
            location: item.location,
          }}
          showId={Number(showId)}
          ticketId={Number(ticketId)}
        />
        <div className='mt-8'>
          <h2 className='text-2xl font-semibold mb-4'>Most Sold Tickets</h2>
          <MostSoldTickets
            tickets={item.mostSoldTickets}
            onTicketSelect={() => {}}
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
      <FullFooterWithBanner />
    </>
  );
};

export default BidPage;
