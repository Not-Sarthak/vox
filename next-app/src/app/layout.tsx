import type { Metadata } from "next";
import "@coinbase/onchainkit/styles.css";
import "./globals.css";
import { Providers } from "@/context/Provider";
import { Navbar } from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: "Vox",
  description: "",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎤</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="w-screen border-t-[2px] absolute top-14 left-0 border-black/10" />

          <div className="max-w-6xl px-4 lg:px-0 mx-auto">
            <div className="w-full border-x-[2px] border-black/10">
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-6xl">
                <Navbar />
              </div>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
