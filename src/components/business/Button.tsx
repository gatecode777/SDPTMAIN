"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "orange";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  type = "button",
  disabled = false
}: ButtonProps) {
  const baseStyle = "px-6 py-3.5 font-semibold text-[15px] transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 focus:ring-blue-500",
    secondary: "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-gray-300",
    orange: "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 focus:ring-orange-500"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(baseStyle, variants[variant], disabled && "opacity-50 cursor-not-allowed pointer-events-none", className)}
    >
      {children}
    </motion.button>
  );
}
