"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverLift?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  hoverLift = true
}: CardProps) {
  const baseStyle = "bg-white rounded-2xl border border-gray-100/80 shadow-sm p-6 transition-all duration-300";
  const hoverStyle = hoverLift ? "hover:shadow-xl hover:-translate-y-1 hover:border-gray-200/50" : "";

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={hoverLift ? { y: -4 } : undefined}
        whileTap={{ scale: 0.99 }}
        className={`${baseStyle} ${hoverStyle} text-left w-full cursor-pointer ${className}`}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
}
