import { Navbar } from "@/components/navbar/navbar";
import FooterWithBanner from "@/components/footer/footer";
import SellHero from "@/components/sell/sell-hero";

export default async function Explore() {
  return (
    <>
      <main className='w-full min-h-screen flex justify-center'>
        <div className='max-w-6xl w-full'>
          <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-20'>
            <Navbar />
          </div>
          <div className='pt-16 h-full'>
            <SellHero />
          </div>
        </div>
      </main>
      <FooterWithBanner />
    </>
  );
}
