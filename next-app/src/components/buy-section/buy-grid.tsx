"use client";

import React, { useEffect } from "react";
import BuyCard from "../cards/buy-card";
import { useBuyStore, generateSlug } from "../../store/store";
import { useRouter } from "next/navigation";
import Shimmer from "../loaders/shimmer";

const BuyGrid = () => {
  const { items, isLoading, error, fetchConcerts } = useBuyStore();
  const router = useRouter();

  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]); 

  const handleCardClick = (title: string) => {
    const slug = generateSlug(title);
    router.push(`/buy/${slug}`);
  };

  if (isLoading) return <div><Shimmer /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='grid p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {items.map((item, idx) => (
        <BuyCard
          key={idx}
          {...item}
          onClick={() => handleCardClick(item.title)}
        />
      ))}
    </div>
  );
};

export default BuyGrid;
