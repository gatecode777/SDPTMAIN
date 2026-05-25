"use client";

import React, { createContext, useState, useEffect } from "react";
import { getProducts } from "@/actions/product";
import { useSession } from "next-auth/react";
import { syncUserWishlist, getUserData } from "@/actions/user-sync";

export const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const storageKey = userEmail ? `pc_wishlist_${userEmail}` : "pc_wishlist_guest";

  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  
  useEffect(() => {
    const loadWishlist = async () => {
      if (status === "authenticated") {
        const res = await getUserData();
        if (res.success && res.wishlist) {
          setWishlist(new Set(res.wishlist));
        }
      } else {
        const stored = localStorage.getItem(storageKey);
        setWishlist(stored ? new Set(JSON.parse(stored)) : new Set());
      }
      setIsInitialLoad(false);
    };

    loadWishlist();
  }, [status, storageKey]);

  
  const fetchWishlistItems = async () => {
    if (wishlist.size === 0) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const ids = Array.from(wishlist);
      const data = await getProducts({ _id: { $in: ids } }, 1, 50);
      setWishlistItems(data.products);
    } catch (error) {
      console.error("Failed to fetch wishlist items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad) return;

    if (status === "authenticated") {
      syncUserWishlist([...wishlist]);
    } else {
      localStorage.setItem(storageKey, JSON.stringify([...wishlist]));
    }
    fetchWishlistItems();
  }, [wishlist, status, storageKey, isInitialLoad]);

  const toggleWishlist = async (id: string) => {
    const next = new Set(wishlist);
    const Swal = (await import("sweetalert2")).default;
    if (next.has(id)) {
      next.delete(id);
      Swal.fire({
        title: "Removed from Wishlist",
        text: "Item has been removed from your wishlist.",
        icon: "info",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      next.add(id);
      Swal.fire({
        title: "Added to Wishlist!",
        text: "Item saved to your wishlist.",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    setWishlist(next);
  };

  const removeFromWishlist = (id: string) => {
    const next = new Set(wishlist);
    next.delete(id);
    setWishlist(next);
  };

  const clearWishlist = () => setWishlist(new Set());

  const isInWishlist = (id: string) => wishlist.has(id);

  const getWishlistItems = () => wishlistItems;

  const wishlistCount = wishlist.size;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistItems,
        wishlistCount,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
