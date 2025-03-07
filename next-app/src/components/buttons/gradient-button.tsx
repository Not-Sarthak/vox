"use client";

import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const GradientButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`h-11 px-4 py-2 bg-gradient-to-b from-[#272727] to-black rounded-lg shadow-inner border border-black flex justify-start items-center gap-3 text-center text-white text-sm font-medium leading-[16.80px] font-inter ${className}`}
      onClick={onClick}
      type='button'
    >
      {label}
    </button>
  );
};

export default GradientButton;
