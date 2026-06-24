"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { FiHeart, FiShoppingBag, FiEye, FiStar } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import QuickViewModal from "./QuickViewModal";

interface Product {
  _id: string;
  name: string;
  offerPrice: number;
  mrp: number;
  category: any;
  thumbnail: string;
  badge?: string;
  averageRating?: number;
  totalReviews?: number;
  shortDescription?: string;
  description?: string;
  images?: string[];
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar key={s} size={11} className={s <= Math.round(rating) ? "star-filled" : "star-empty"} />
    ))}
  </div>
);

const ProductCard = ({ product, view }: { product: Product; view: string }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  const discount = (product.mrp && product.mrp > product.offerPrice)
    ? Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100)
    : 0;

  return (
    <div className={`pcard ${view === "list" ? "pcard--list" : ""}`}>
      <div className="pcard-img-wrap" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer', position: 'relative' }}>
        <Image src={product.thumbnail || "/images/placeholder.png"} alt={product.name} fill className="pcard-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 250px" />
        {product.badge && <span className="pcard-badge">{product.badge}</span>}
        {discount > 0 && <span className="pcard-discount">-{discount}%</span>}
        <div className="pcard-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`pcard-act ${isInWishlist(product._id) ? "pcard-act--wished" : ""}`}
            aria-label="Wishlist"
            onClick={() => toggleWishlist(product._id)}
            title="Wishlist"
          >
            <FiHeart size={14} />
          </button>
          <button className="pcard-act" aria-label="Quick View" onClick={() => setIsModalOpen(true)} title="Quick View">
            <FiEye size={14} />
          </button>
        </div>
        <button className="pcard-cart" onClick={(e) => {
          e.stopPropagation();
          addToCart({
            id: product._id,
            name: product.name,
            price: product.offerPrice,
            img: product.thumbnail,
            qty: 1
          });
        }}>
          <FiShoppingBag size={14} /> Add to Cart
        </button>
        <QuickViewModal 
          product={product as any} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
      <div className="pcard-body" onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
        <span className="pcard-cat">{typeof product.category === 'object' ? product.category.name : "Hardware"}</span>
        <h3 className="pcard-name">{product.name}</h3>
        <div className="pcard-rating">
          <Stars rating={product.averageRating || 5} />
          <span className="pcard-reviews">({product.totalReviews || 0})</span>
        </div>
        {product.shortDescription && <p className="pcard-desc">{product.shortDescription}</p>}
        <div className="pcard-price-row">
          <span className="pcard-price">{fmt(product.offerPrice)}</span>
          {product.mrp && product.mrp > product.offerPrice && (
            <span className="pcard-orig">{fmt(product.mrp)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ products, view }: { products: Product[]; view: string }) => {
  if (products.length === 0) {
    return (
      <div className="shop-empty">
        <span>😕</span>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search</p>
      </div>
    );
  }

  return (
    <div className={`products-grid ${view === "list" ? "products-grid--list" : ""}`}>
      {products.map((p) => (
        <ProductCard key={p._id} product={p} view={view} />
      ))}
    </div>
  );
};

export default ProductGrid;
