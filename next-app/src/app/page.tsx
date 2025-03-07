import FooterWithBanner from "@/components/footer/footer";
import Hero from "@/components/landing/hero";

export default function Explore() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full flex-grow">
        <div className="max-w-6xl mx-auto w-full relative">
          <div className="pt-16">
            <Hero />
          </div>
        </div>
      </main>
      <FooterWithBanner />
    </div>
  );
}
