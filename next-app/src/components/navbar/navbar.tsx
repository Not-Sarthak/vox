"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import {
  ConnectWallet,
  ConnectWalletText,
} from "@coinbase/onchainkit/wallet";

export const Navbar: React.FC = () => {
  const [position, setPosition] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { disconnect, connectors } = useDisconnect();

  const handleDisconnect = useCallback(() => {
    // Disconnect all the connectors (wallets). Usually only one is connected
    connectors.map((connector) => disconnect({ connector }));
    setIsDropdownOpen(false);
  }, [disconnect, connectors]);

  const navItems = [
    { name: "Vox", path: "/" },
    { name: "Buy", path: "/buy" },
    { name: "Sell", path: "/sell" },
  ];

  if (isConnected) {
    navItems.push({ name: "Profile", path: "/profile" });
  }

  return (
    <nav className='bg-white p-1 shadow-md w-fit rounded-xl mx-auto font-bricolage'>
      <ul
        onMouseLeave={() => {
          setPosition((prev) => ({
            ...prev,
            opacity: 0,
          }));
          setActiveTab(null);
          setIsDropdownOpen(false);
        }}
        className='relative mx-auto flex items-center w-fit rounded-xl bg-[#F8F8F8] p-1'
      >
        {navItems.map((item, index) => (
          <Tab
            key={item.name}
            index={index}
            setPosition={setPosition}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            isActive={pathname === item.path}
            href={item.path}
            isProfile={item.name === "Profile"}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          >
            <div
              className={`text-center ${
                index === 0 ? "text-xl font-semibold" : "text-base"
              } text-custom-gray text-nowrap font-inter leading-tight`}
            >
              {index === 0 && "🎤 "}
              {item.name}
            </div>
            {item.name === "Profile" && (
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      <button
                        onClick={handleDisconnect}
                        className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <svg 
                          className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Disconnect
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </Tab>
        ))}
        {!isConnected && (
          <li className="relative z-10 ml-2">
            <ConnectWallet className='h-10 px-4 py-2 bg-gradient-to-b from-[#272727] to-black rounded-lg shadow-inner border border-black'>
              <ConnectWalletText>Connect</ConnectWalletText>
            </ConnectWallet>
          </li>
        )}
        <Cursor position={position} />
      </ul>
    </nav>
  );
};

interface TabProps {
  index: number;
  children: React.ReactNode;
  setPosition: React.Dispatch<
    React.SetStateAction<{
      left: number;
      width: number;
      opacity: number;
    }>
  >;
  setActiveTab: React.Dispatch<React.SetStateAction<number | null>>;
  activeTab: number | null;
  isActive: boolean;
  href: string;
  isProfile?: boolean;
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tab: React.FC<TabProps> = ({
  index,
  children,
  setPosition,
  setActiveTab,
  isActive,
  href,
  isProfile,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const ref = useRef<HTMLLIElement | null>(null);

  const handleMouseEnter = () => {
    if (!ref.current) return;

    const { width } = ref.current.getBoundingClientRect();

    setPosition({
      left: ref.current.offsetLeft,
      width,
      opacity: 1,
    });

    setActiveTab(index);

    if (isProfile && setIsDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <li
      id={`tab-${index}`}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={`relative z-10 block cursor-pointer px-4 py-1 ${
        isActive ? "text-offwhite" : "text-light-gray"
      }`}
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};

interface CursorProps {
  position: {
    left: number;
    width: number;
    opacity: number;
  };
}

const Cursor: React.FC<CursorProps> = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className='absolute z-0 h-10 rounded-xl bg-white shadow-lg border border-gray-200'
    />
  );
};