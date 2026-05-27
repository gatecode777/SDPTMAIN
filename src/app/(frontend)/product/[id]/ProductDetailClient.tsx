"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiShoppingCart, FiHeart, FiShield, FiTruck, FiRefreshCw, FiChevronRight, FiSearch } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import "./ProductDetail.css";

interface Product {
  _id: string;
  name: string;
  offerPrice: number;
  mrp: number;
  thumbnail: string;
  images?: string[];
  category: any;
  brand?: string;
  averageRating?: number;
  totalReviews?: number;
  description?: string;
  shortDescription?: string;
  specifications?: Record<string, string>;
  badge?: string;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="pd-stars">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "star-f" : "star-e"}>★</span>
    ))}
    <span className="pd-rating-num">({rating})</span>
  </div>
);

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Image Magnifier & Gallery States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setImgSize] = useState([0, 0]);
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsHoverable(mediaQuery.matches);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverable) return;
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setImgSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverable) return;
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();
    
    // Calculate cursor position relative to the image
    let posX = e.clientX - left;
    let posY = e.clientY - top;

    // Constrain cursor coordinates within image boundaries
    posX = Math.max(0, Math.min(posX, width));
    posY = Math.max(0, Math.min(posY, height));

    setXY([posX, posY]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
  const currentImage = allImages[activeImageIndex] || "/images/placeholder.png";

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
  const discount = product.mrp > product.offerPrice ? Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100) : 0;

  return (
    <div className="pd-page pd">
      <div className="pd-breadcrumb">
        <div className="pd-container">
          <Link href="/">Home</Link> <FiChevronRight /> <Link href="/shop">Shop</Link> <FiChevronRight /> <span>{product.name}</span>
        </div>
      </div>

      <div className="pd-container pd-layout">
        <div className="pd-gallery">
          <div className="pd-main-img" style={{ position: "relative" }}>
            {product.badge && <span className="pd-badge">{product.badge}</span>}
            <div 
              className="pd-main-img-container"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image 
                src={currentImage} 
                alt={product.name} 
                fill 
                style={{ objectFit: "contain" }} 
                sizes="(max-width: 768px) 100vw, 500px" 
                priority 
              />
              
              {isHoverable && showMagnifier && (
                <div
                  className="pd-lens"
                  style={{
                    backgroundImage: `url('${currentImage}')`,
                    backgroundSize: `${imgWidth * 2.5}px ${imgHeight * 2.5}px`,
                    left: `${x - 90}px`,
                    top: `${y - 90}px`,
                    backgroundPosition: `${-x * 2.5 + 90}px ${-y * 2.5 + 90}px`,
                  }}
                />
              )}

              {isHoverable && (
                <span className="pd-zoom-hint">
                  <FiSearch size={12} /> Hover to zoom
                </span>
              )}
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="pd-thumbs">
              {allImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`pd-thumb ${activeImageIndex === i ? "pd-thumb--on" : ""}`}
                  onClick={() => setActiveImageIndex(i)}
                  style={{ position: "relative" }}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${i}`} 
                    fill 
                    style={{ objectFit: "cover" }} 
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <span className="pd-cat">{typeof product.category === 'object' ? product.category.name : "Hardware"}</span>
          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-rating-row">
            <Stars rating={product.averageRating || 5} />
            <span className="pd-rating-cnt">({product.totalReviews || 0} Customer Reviews)</span>
            <span className="pd-stock">In Stock</span>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">{fmt(product.offerPrice)}</span>
            {product.mrp > product.offerPrice && <span className="pd-orig">{fmt(product.mrp)}</span>}
            {discount > 0 && <span className="pd-save">Save {discount}%</span>}
          </div>

          <p className="pd-desc">
            {product.shortDescription || 
              (product.description ? product.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + "..." : "No description available.")}
          </p>

          <div className="pd-qty-row">
            <div className="pd-qty">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button 
              className="pd-add-btn" 
              onClick={() => addToCart({
                id: product._id,
                name: product.name,
                price: product.offerPrice,
                img: currentImage,
                qty
              })}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button 
              className={`pd-wish-btn ${isInWishlist(product._id) ? "pd-wish-btn--on" : ""}`}
              onClick={() => toggleWishlist(product._id)}
            >
              <FiHeart />
            </button>
          </div>

          <div className="pd-trust">
            <div className="pd-trust-item"><FiShield /> <span>2 Year Warranty</span></div>
            <div className="pd-trust-item"><FiTruck /> <span>Free Shipping</span></div>
            <div className="pd-trust-item"><FiRefreshCw /> <span>30 Day Returns</span></div>
          </div>
        </div>
      </div>

      <div className="pd-tabs-wrap">
        <div className="pd-container">
          <div className="pd-tabs">
            <button className={`pd-tab ${activeTab === "description" ? "pd-tab--on" : ""}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`pd-tab ${activeTab === "specs" ? "pd-tab--on" : ""}`} onClick={() => setActiveTab("specs")}>Specifications</button>
            <button className={`pd-tab ${activeTab === "reviews" ? "pd-tab--on" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews ({product.totalReviews || 0})</button>
          </div>
          <div className="pd-tab-content">
            {activeTab === "description" && (
              <div className="pd-desc-full">
                <div dangerouslySetInnerHTML={{ __html: product.description || "No description available." }} />
              </div>
            )}
            {activeTab === "specs" && (
              <div className="pd-specs-table">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div className="pd-spec-row" key={key}>
                      <div className="pd-spec-key">{key}</div>
                      <div className="pd-spec-val">{val}</div>
                    </div>
                  ))
                ) : (
                  <p>No specifications provided for this component.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

