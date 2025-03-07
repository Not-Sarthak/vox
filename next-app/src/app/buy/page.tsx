import Head from "next/head";
import { Navbar } from "@/components/navbar/navbar";
import FooterWithBanner from "@/components/footer/footer";
import BuyHero from "@/components/buy-section/buy-hero";

export default function BuyPage() {
  return (
    <>
      <main className='w-full min-h-screen flex justify-center'>
        <div className='max-w-6xl w-full'>
          <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-20'>
            <Navbar />
          </div>
          <div className='pt-16 h-full'>
            <BuyHero />
          </div>
        </div>
      </main>
      <FooterWithBanner />
    </>
  );
}
