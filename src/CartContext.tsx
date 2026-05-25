"use client";

import React, { createContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { syncUserCart, getUserData } from "@/actions/user-sync";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const storageKey = userEmail ? `pc_cart_${userEmail}` : "pc_cart_guest";

  const [cart, setCart] = useState<any[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  
  useEffect(() => {
    const loadCart = async () => {
      if (status === "authenticated") {
        const res = await getUserData();
        if (res.success && res.cart) {
          setCart(res.cart);
        }
      } else {
        const storedCart = localStorage.getItem(storageKey);
        if (storedCart) {
          try {
            setCart(JSON.parse(storedCart));
          } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
          }
        } else {
          setCart([]);
        }
      }
      setIsInitialLoad(false);
    };
    
    loadCart();
  }, [status, storageKey]);

  
  useEffect(() => {
    if (isInitialLoad) return;

    if (status === "authenticated") {
      syncUserCart(cart);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }
  }, [cart, status, storageKey, isInitialLoad]);

  const addToCart = async (product: any) => {
    const isLoggedIn = status === "authenticated" || (status === "loading" && localStorage.getItem('isLoggedIn') === 'true');
    
    if (!isLoggedIn) {
      window.dispatchEvent(new Event('openAuthModal'));
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        title: "Login Required",
        text: "Please sign in to add items to your cart.",
        icon: "info",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setCart((prev) => {
      
      const productId = product.id || product._id;
      const existing = prev.find((i) => i.id === productId);
      
      if (existing) {
        return prev.map((i) => i.id === productId ? { ...i, qty: i.qty + (product.qty || 1) } : i);
      }
      return [...prev, { ...product, id: productId, qty: product.qty || 1 }];
    });

    const Swal = (await import("sweetalert2")).default;
    Swal.fire({
      title: "Added to Cart!",
      text: `${product.name} is now in your cart.`,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const removeFromCart = (id: any) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: any, qty: number) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
