"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import { FiX, FiShoppingCart, FiHeart, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import "./QuickViewModal.css";

interface Product {
  _id: string;
  name: string;
  offerPrice: number;
  mrp: number;
  description: string;
  shortDescription?: string;
  category: {
    _id: string;
    name: string;
  } | string;
  thumbnail: string;
  images: string[];
  averageRating?: number;
  totalReviews?: number;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [activeImage, setActiveImage] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveImage(0);
      const timer = setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!product) return null;

  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
  const discount = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  const nextImage = () => setActiveImage((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="qv-overlay" onClick={onClose}>
          <motion.div 
            className="qv-container" 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button className="qv-close" onClick={onClose} aria-label="Close modal" autoFocus>
              <FiX size={24} />
            </button>

            <div className="qv-content" ref={contentRef}>
              <div className="qv-gallery">
                <div className="qv-main-img-wrap" style={{ position: "relative" }}>
                  <motion.div 
                    key={activeImage}
                    className="qv-main-img"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <Image
                      src={allImages[activeImage] || "/images/placeholder.png"}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </motion.div>
                  {allImages.length > 1 && (
                    <>
                      <button className="qv-nav qv-nav--prev" onClick={prevImage} style={{ zIndex: 5 }}><FiChevronLeft size={20} /></button>
                      <button className="qv-nav qv-nav--next" onClick={nextImage} style={{ zIndex: 5 }}><FiChevronRight size={20} /></button>
                    </>
                  )}
                  {discount > 0 && <span className="qv-discount" style={{ zIndex: 5 }}>-{discount}% OFF</span>}
                </div>
                <div className="qv-thumbs">
                  {allImages.map((img, i) => (
                    <div 
                      key={i} 
                      className={`qv-thumb ${activeImage === i ? "qv-thumb--active" : ""}`}
                      onClick={() => setActiveImage(i)}
                      style={{ position: 'relative' }}
                    >
                      <Image 
                        src={img || "/images/placeholder.png"} 
                        alt={`${product.name} thumb ${i}`} 
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="qv-details">
                <div className="qv-header">
                  <span className="qv-cat">{typeof product.category === 'object' ? product.category.name : "Premium Hardware"}</span>
                  <h2 className="qv-name">{product.name}</h2>
                  <div className="qv-rating">
                    <div className="qv-stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={14} className={i < (product.averageRating || 5) ? "qv-star--filled" : "qv-star--empty"} />
                      ))}
                    </div>
                    <span className="qv-reviews">({product.totalReviews || 0} customer reviews)</span>
                  </div>
                </div>

                <div className="qv-price-box">
                  <span className="qv-price">{fmt(product.offerPrice)}</span>
                  {product.mrp > product.offerPrice && (
                    <span className="qv-mrp">{fmt(product.mrp)}</span>
                  )}
                </div>

                <div className="qv-desc-wrap">
                  <h4 className="qv-section-title">Description</h4>
                  <p className="qv-short-desc">{product.shortDescription || "High-performance component designed for enthusiasts."}</p>
                  <div className="qv-full-desc" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>

                <div className="qv-actions">
                  <button 
                    className="qv-add-cart"
                    onClick={() => {
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.offerPrice,
                        img: product.thumbnail,
                        qty: 1
                      });
                      onClose();
                    }}
                  >
                    <FiShoppingCart size={18} /> Add to Cart
                  </button>
                  <button 
                    className={`qv-wishlist ${isInWishlist(product._id) ? "qv-wishlist--active" : ""}`}
                    onClick={() => toggleWishlist(product._id)}
                  >
                    <FiHeart size={18} />
                  </button>
                </div>

                <div className="qv-meta">
                  <div className="qv-meta-item">
                    <span>Availability:</span>
                    <span className="qv-stock">In Stock</span>
                  </div>
                  <div className="qv-meta-item">
                    <span>Shipping:</span>
                    <span>Free Standard Delivery</span>
                  </div>
                </div>


              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
