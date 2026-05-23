"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Bestseller.css";
import "./Skeleton.css";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import { getProducts } from "@/actions/product";
import QuickViewModal from "./shop/QuickViewModal";

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
}

const tabs = ["All", "GPUs", "CPUs", "Storage", "Memory", "Cases"];

const BestSeller = () => {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

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
              <button key={tab} className={`bs-tab ${activeTab === tab ? "bs-tab--active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
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
              <div className="pc" key={p._id}>
                <div className="pc-img-wrap" onClick={() => { setSelectedProduct(p); setIsModalOpen(true); }} style={{ cursor: 'pointer', position: 'relative' }}>
                  <Image src={p.thumbnail || "/images/placeholder.png"} alt={p.name} fill className="pc-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" />
                  <div className="pc-overlay"></div>
                  {p.badge && <span className="pc-badge">{p.badge}</span>}
                  <div className="pc-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="pc-action pc-action--cart" 
                      aria-label="Add to cart"
                      onClick={() => addToCart({
                        id: p._id,
                        name: p.name,
                        price: p.offerPrice,
                        img: p.thumbnail,
                        qty: 1
                      })} 
                      title="Add to cart"
                    >
                      <FiShoppingCart size={16} />
                    </button>
                    <button 
                      className={`pc-action ${isInWishlist(p._id) ? "pc-action--liked" : ""}`} 
                      aria-label="Wishlist"
                      onClick={() => toggleWishlist(p._id)} 
                      title="Wishlist"
                    >
                      <FiHeart size={16} />
                    </button>
                    <button 
                      className="pc-action" 
                      aria-label="Quick view"
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsModalOpen(true);
                      }}
                      title="Quick view"
                    >
                      <FiEye size={16} />
                    </button>
                  </div>
                </div>
                <div className="pc-body" onClick={() => { setSelectedProduct(p); setIsModalOpen(true); }} style={{ cursor: 'pointer' }}>
                  <h3 className="pc-name">{p.name}</h3>
                  <div className="pc-rating">
                    <div className="pc-stars">{renderStars(p.averageRating || 5)}</div>
                    <span className="pc-reviews">({p.totalReviews || 0})</span>
                  </div>
                  <div className="pc-price-row">
                    <span className="pc-price">{fmt(p.offerPrice)}</span>
                    {p.mrp > p.offerPrice && (
                      <span className="pc-original">{fmt(p.mrp)}</span>
                    )}
                  </div>
                  {p.shortDescription && (
                    <p className="pc-desc-mini">{p.shortDescription.substring(0, 60)}...</p>
                  )}
                </div>
              </div>
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
