"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/CartContext";
import { WishlistProvider } from "@/WishlistContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth" refetchInterval={0} refetchOnWindowFocus={false}>
      <CartProvider>
        <WishlistProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
