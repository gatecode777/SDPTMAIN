"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./Bestseller.css";
import "./Skeleton.css";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import { getProducts } from "@/actions/product";
import dynamic from "next/dynamic";
import ProductCard from "./shop/ProductCard";

const QuickViewModal = dynamic(() => import("./shop/QuickViewModal"), { ssr: false });

interface Product {
  _id: string;
  name: string;
  offerPrice: number;
  mrp: number;
  thumbnail: string;
  shortDescription?: string;
  badge?: string;
  averageRating?: number;
  totalReviews?: number;
  description?: string;
  images?: string[];
}

const tabs = ["All", "GPUs", "CPUs", "Storage", "Memory", "Cases"];

const BestSeller = ({ initialProducts = [] }: { initialProducts?: Product[] }) => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState<Product[]>(
    activeTab === "All" && initialProducts.length > 0 ? initialProducts : []
  );
  const [loading, setLoading] = useState(
    activeTab === "All" && initialProducts.length > 0 ? false : true
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (activeTab === "All" && initialProducts.length > 0) return;
    }

    if (activeTab === "All" && initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [activeTab]); // Intentionally omitting initialProducts to prevent unnecessary loops

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query: Record<string, any> = { status: "PUBLISHED" };
      
      
      if (activeTab === "GPUs") query.name = { $regex: "Graphics", $options: "i" };
      if (activeTab === "CPUs") query.name = { $regex: "Processor|Intel|AMD", $options: "i" };
      if (activeTab === "Storage") query.name = { $regex: "SSD|HDD|NVMe", $options: "i" };
      if (activeTab === "Memory") query.name = { $regex: "RAM|DDR", $options: "i" };
      if (activeTab === "Cases") query.name = { $regex: "Case|Tower", $options: "i" };

      const data = await getProducts(query, 1, 8);
      setProducts(data.products);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch bestsellers";
      console.error("Bestseller fetch failed:", message);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  const renderStars = (rating: number = 5) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`bs-star ${i < Math.floor(rating) ? "bs-star--filled" : ""}`}>★</span>
    ));
  };

  const getFilterUrl = () => {
    if (activeTab === "All") return "/shop";
    if (activeTab === "GPUs") return "/shop?q=Graphics";
    if (activeTab === "CPUs") return "/shop?q=Processor";
    if (activeTab === "Storage") return "/shop?q=Storage";
    if (activeTab === "Memory") return "/shop?q=RAM";
    if (activeTab === "Cases") return "/shop?q=Case";
    return "/shop";
  };

  return (
    <section className="bs">
      <div className="bs-container">
        <div className="bs-header">
          <div className="bs-header-text">
            <span className="bs-label">Featured Collection</span>
            <h2 className="bs-title">Best Sellers</h2>
            <p className="bs-subtitle">Premium components trusted by 50K+ customers worldwide</p>
          </div>
          <div className="bs-tabs">
            {tabs.map((tab) => (
              <button key={tab} className={`bs-tab ${activeTab === tab ? "bs-tab--active" : ""}`} onClick={() => setActiveTab(tab)} suppressHydrationWarning>{tab}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bs-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="bs-skeleton-card" key={i}>
                <div className="bs-skeleton-img skeleton-block" />
                <div className="bs-skeleton-body">
                  <div className="bs-skeleton-name skeleton-block" />
                  <div className="bs-skeleton-name-short skeleton-block" />
                  <div className="bs-skeleton-stars skeleton-block" />
                  <div className="bs-skeleton-price skeleton-block" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="bs-grid">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                isInWishlist={isInWishlist}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
                setIsModalOpen={setIsModalOpen}
              />
            ))}
          </div>
        ) : (
          <div className="bs-empty">
            <p>No products found in this category.</p>
            <Link href="/shop" className="bs-view-all">Browse Store</Link>
          </div>
        )}

        <div className="bs-footer">
          <Link href={getFilterUrl()} className="bs-view-all" onClick={() => window.scrollTo(0, 0)}>
            View All {activeTab !== "All" ? activeTab : "Products"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
      <QuickViewModal 
        product={selectedProduct as any} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default BestSeller;
