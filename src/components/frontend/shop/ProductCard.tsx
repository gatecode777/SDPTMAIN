"use client";

import React from "react";
import Image from "next/image";
import { FiShoppingCart, FiHeart, FiEye, FiStar } from "react-icons/fi";

interface Product {
  _id: string;
  name: string;
  offerPrice: number;
  mrp: number;
  thumbnail: string;
  shortDescription?: string;
  description?: string;
  badge?: string;
  averageRating?: number;
  totalReviews?: number;
  category?: any;
}

interface ProductCardProps {
  product: any;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  addToCart: (item: any) => void;
  setSelectedProduct: (product: any) => void;
  setIsModalOpen: (open: boolean) => void;
  viewType?: string; // "grid" or "list"
}

// Helper to extract clean technical specs from the product
const getProductSpecs = (product: Product): string[] => {
  const name = product.name || "";
  let desc = product.shortDescription || "";
  if (!desc && product.description) {
    desc = product.description.replace(/<[^>]*>?/gm, '');
  }
  const specs: string[] = [];

  const patterns = [
    /\b\d+GB\b/i,
    /\b\d+TB\b/i,
    /\bGDDR6X?\b/i,
    /\bDDR[45]\b/i,
    /\bNVMe\b/i,
    /\bLHR\b/i,
    /\b\d+W\b/i,
    /\bATX\b/i,
    /\bMicro-ATX\b/i,
    /\bMini-ITX\b/i,
    /\b80\s*Plus\b\s*(Bronze|Gold|Platinum)?/i,
  ];

  patterns.forEach((pattern) => {
    const match = name.match(pattern) || desc.match(pattern);
    if (match) {
      specs.push(match[0].toUpperCase());
    }
  });

  if (specs.length < 2 && desc) {
    const cleaned = desc
      .split(/[•,;|]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length < 15);
    cleaned.slice(0, 3).forEach((item) => {
      if (!specs.includes(item)) specs.push(item);
    });
  }

  const uniqueSpecs = Array.from(new Set(specs)).slice(0, 3);
  if (uniqueSpecs.length === 0) {
    return ["In Stock", "Premium Build"];
  }
  return uniqueSpecs;
};

export default function ProductCard({
  product,
  isInWishlist,
  toggleWishlist,
  addToCart,
  setSelectedProduct,
  setIsModalOpen,
  viewType = "grid",
}: ProductCardProps) {
  const specs = getProductSpecs(product);

  const fmt = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.mrp > product.offerPrice
    ? Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100)
    : 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const rating = product.averageRating || 5;
  const reviewsCount = product.totalReviews || 0;

  return (
    <div className={`pc ${viewType === "list" ? "pc-list-mode" : ""}`}>
      <div className="pc-img-wrap" onClick={handleCardClick} style={{ cursor: 'pointer', position: 'relative' }}>
        {discount > 0 ? (
          <span className="pc-badge">-{discount}% OFF</span>
        ) : (
          <span className="pc-badge-tag">best seller</span>
        )}
        
        {/* Top-right floating actions column on hover */}
        <div className="pc-actions-top-right" onClick={(e) => e.stopPropagation()}>
          <button
            className={`pc-action-btn ${isInWishlist(product._id) ? "pc-action-btn--liked" : ""}`}
            onClick={() => toggleWishlist(product._id)}
            title="Wishlist"
            suppressHydrationWarning
          >
            <FiHeart size={18} />
          </button>
          <button
            className="pc-action-btn pc-action-btn--cart"
            onClick={() => addToCart({
              id: product._id,
              name: product.name,
              price: product.offerPrice,
              img: product.thumbnail,
              qty: 1
            })}
            title="Add to Cart"
            suppressHydrationWarning
          >
            <FiShoppingCart size={18} />
          </button>
          <button
            className="pc-action-btn"
            onClick={handleCardClick}
            title="Quick View"
            suppressHydrationWarning
          >
            <FiEye size={18} />
          </button>
        </div>

        <Image
          src={product.thumbnail || "/images/placeholder.png"}
          alt={product.name}
          fill
          className="pc-img"
          sizes="(max-width: 768px) 100vw, 300px"
          style={{ objectFit: 'contain' }}
        />
        <div className="pc-overlay"></div>
      </div>

      <div className="pc-body">
        {/* Stars rating row */}
        <div className="pc-rating-row">
          <div className="pc-stars">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={12}
                className={i < rating ? "pc-star--filled" : "pc-star--empty"}
              />
            ))}
          </div>
          <span className="pc-reviews-count">({reviewsCount || 10})</span>
        </div>

        {/* Title and Price in the same row */}
        <div className="pc-title-price-row">
          <h3 className="pc-name" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            {product.name}
          </h3>
          <span className="pc-price">{fmt(product.offerPrice)}</span>
        </div>

        {/* Specs subtitle */}
        <div className="pc-subtitle" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
          {specs.join(" • ")}
        </div>

        {/* Bottom Actions Row: Add to Cart button + Quick View icon button */}
        <div className="pc-bottom-actions-row">
          <button
            className="pc-add-to-cart-bar"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: product._id,
                name: product.name,
                price: product.offerPrice,
                img: product.thumbnail,
                qty: 1
              });
            }}
            suppressHydrationWarning
          >
            <FiShoppingCart size={15} style={{ marginRight: '6px' }} /> add to cart
          </button>
          
          <button
            className="pc-quick-view-btn-bottom"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            title="Quick View"
            suppressHydrationWarning
          >
            <FiEye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
