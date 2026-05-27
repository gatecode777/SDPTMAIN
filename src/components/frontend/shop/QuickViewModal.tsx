"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import { FiX, FiShoppingCart, FiHeart, FiStar, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
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

  // Magnifier States
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

    // Constrain coordinates within bounds
    posX = Math.max(0, Math.min(posX, width));
    posY = Math.max(0, Math.min(posY, height));

    setXY([posX, posY]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveImage(0);
      setShowMagnifier(false);
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

  const nextImage = () => {
    setShowMagnifier(false);
    setActiveImage((prev) => (prev + 1) % allImages.length);
  };
  const prevImage = () => {
    setShowMagnifier(false);
    setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

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
                <div 
                  className="qv-main-img-wrap" 
                  style={{ position: "relative" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
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

                  {isHoverable && showMagnifier && (
                    <div
                      className="qv-lens"
                      style={{
                        position: "absolute",
                        pointerEvents: "none",
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        border: "2.5px solid rgba(255, 255, 255, 0.9)",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), inset 0 0 15px rgba(0, 0, 0, 0.15)",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "#fff",
                        backgroundImage: `url('${allImages[activeImage] || "/images/placeholder.png"}')`,
                        backgroundSize: `${imgWidth * 2.5}px ${imgHeight * 2.5}px`,
                        left: `${x - 75}px`,
                        top: `${y - 75}px`,
                        backgroundPosition: `${-x * 2.5 + 75}px ${-y * 2.5 + 75}px`,
                        zIndex: 20,
                      }}
                    />
                  )}

                  {isHoverable && (
                    <span className="qv-zoom-hint">
                      <FiSearch size={12} /> Hover to zoom
                    </span>
                  )}
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
                  {product.shortDescription && <p className="qv-short-desc">{product.shortDescription}</p>}
                  {product.description && <div className="qv-full-desc" dangerouslySetInnerHTML={{ __html: product.description }} />}
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
