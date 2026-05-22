"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiHeart, FiTrash2, FiShoppingBag, FiArrowLeft,
  FiStar, FiEye, FiShare2, FiX, FiLoader
} from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import Swal from "sweetalert2";
import "./WishlistPage.css";
import QuickViewModal from "@/components/frontend/shop/QuickViewModal";

const Stars = ({ rating }: { rating: any }) => (
  <div className="wl-stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar key={s} size={12} className={s <= Math.round(rating) ? "star-filled" : "star-empty"} />
    ))}
  </div>
);

const WishlistPage = () => {
  const { getWishlistItems, removeFromWishlist, clearWishlist, wishlistCount, loading } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const items = getWishlistItems();
  const fmt = (n: any) => "₹" + (n || 0).toLocaleString("en-IN");
  const discount = (p: number, o: number) => o > p ? Math.round(((o - p) / o) * 100) : 0;

  const handleRemove = (id: any, name: string) => {
    Swal.fire({
      title: "Remove from Wishlist?",
      text: `Remove ${name} from your wishlist?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        removeFromWishlist(id);
        Swal.fire({
          title: "Removed!",
          text: "Item removed from wishlist.",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleClearAll = () => {
    Swal.fire({
      title: "Clear Wishlist?",
      text: "This will remove all items from your wishlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Clear All",
      cancelButtonText: "Keep Items",
    }).then((res) => {
      if (res.isConfirmed) {
        clearWishlist();
        Swal.fire({
          title: "Cleared!",
          text: "Your wishlist has been cleared.",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleMoveToCart = (product: any) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.offerPrice,
      img: product.thumbnail,
      qty: 1
    });
    removeFromWishlist(product._id);
  };

  const handleAddAllToCart = () => {
    items.forEach((item: any) => {
      addToCart({
        id: item._id,
        name: item.name,
        price: item.offerPrice,
        img: item.thumbnail,
        qty: 1
      });
    });
    clearWishlist();
    Swal.fire({
      title: "All Items Added to Cart!",
      text: "Your wishlist items have been moved to cart.",
      icon: "success",
      confirmButtonColor: "#2563eb",
    });
  };

  const handleShare = () => {
    const text = `Check out my PC Store wishlist:\n${items.map((i: any) => `• ${i.name} - ${fmt(i.offerPrice)}`).join('\n')}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: "My PC Store Wishlist", text });
    } else {
      if (typeof navigator !== 'undefined') {
        navigator.clipboard.writeText(text);
        Swal.fire({
          title: "Copied!",
          text: "Wishlist copied to clipboard.",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="wl-empty">
        <FiLoader className="wl-spinner animate-spin" size={32} />
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="wl-empty">
        <div className="wl-empty-inner">
          <div className="wl-empty-icon">
            <FiHeart size={48} />
          </div>
          <div className="wl-empty-pulse"></div>
          <h2>Your wishlist is empty</h2>
          <p>
            Browse our products and save the items you love.
            Your wishlist makes it easy to find and buy what you want later.
          </p>
          <Link href="/shop" className="wl-shop-btn">
            <FiShoppingBag size={16} /> Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wl-page">
      <div className="wl-header">
        <div className="wl-header-inner">
          <Link href="/shop" className="wl-back">
            <FiArrowLeft size={16} /> Continue Shopping
          </Link>
          <div className="wl-title-row">
            <h1>
              <FiHeart size={28} className="wl-title-icon" />
              My Wishlist
              <span>({wishlistCount} {wishlistCount === 1 ? "item" : "items"})</span>
            </h1>
            <div className="wl-header-actions">
              <button className="wl-action-btn wl-share-btn" onClick={handleShare}>
                <FiShare2 size={15} /> Share
              </button>
              <button className="wl-action-btn wl-clear-btn" onClick={handleClearAll}>
                <FiX size={15} /> Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="wl-content">
        <div className="wl-grid">
          {items.map((item: any, index: number) => (
            <div
              className="wl-card"
              key={item._id}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="wl-card-img-wrap" style={{ position: "relative" }}>
                <Image src={item.thumbnail || "/images/placeholder.png"} alt={item.name} fill className="wl-card-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" />
                {item.badge && <span className="wl-card-badge">{item.badge}</span>}
                {item.mrp > item.offerPrice && (
                  <span className="wl-card-discount">-{discount(item.offerPrice, item.mrp)}%</span>
                )}
                <button
                  className="wl-card-remove"
                  onClick={() => handleRemove(item._id, item.name)}
                  aria-label="Remove from wishlist"
                >
                  <FiTrash2 size={15} />
                </button>
                <div className="wl-card-overlay">
                  <button 
                    className="wl-overlay-btn"
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsModalOpen(true);
                    }}
                  >
                    <FiEye size={15} /> Quick View
                  </button>
                  <button className="wl-overlay-btn wl-overlay-cart" onClick={() => handleMoveToCart(item)}>
                    <FiShoppingBag size={15} /> Move to Cart
                  </button>
                </div>
              </div>
              <div className="wl-card-body">
                <span className="wl-card-cat">{typeof item.category === 'object' ? item.category.name : "Hardware"}</span>
                <Link href={`/product/${item._id}`} className="wl-card-name">{item.name}</Link>
                <div className="wl-card-rating">
                  <Stars rating={item.averageRating || 5} />
                  <span className="wl-card-reviews">({item.totalReviews || 0})</span>
                </div>
                {item.shortDescription && <p className="wl-card-desc">{item.shortDescription.substring(0, 60)}...</p>}
                <div className="wl-card-price-row">
                  <span className="wl-card-price">{fmt(item.offerPrice)}</span>
                  {item.mrp > item.offerPrice && (
                    <span className="wl-card-orig">{fmt(item.mrp)}</span>
                  )}
                </div>
                <button className="wl-card-cart-btn" onClick={() => handleMoveToCart(item)}>
                  <FiShoppingBag size={14} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="wl-summary">
          <h2>Wishlist Summary</h2>

          <div className="wl-summary-stats">
            <div className="wl-stat">
              <span className="wl-stat-label">Total Items</span>
              <span className="wl-stat-value">{wishlistCount}</span>
            </div>
            <div className="wl-stat">
              <span className="wl-stat-label">Total Value</span>
              <span className="wl-stat-value wl-stat-price">
                {fmt(items.reduce((a: number, i: any) => a + (i.offerPrice || 0), 0))}
              </span>
            </div>
            {items.some((i: any) => i.mrp > i.offerPrice) && (
              <div className="wl-stat wl-stat-savings">
                <span className="wl-stat-label">You Save</span>
                <span className="wl-stat-value wl-stat-green">
                  {fmt(items.reduce((a: number, i: any) => a + ((i.mrp || 0) - (i.offerPrice || 0)), 0))}
                </span>
              </div>
            )}
          </div>

          <div className="wl-summary-divider" />

          <button className="wl-add-all-btn" onClick={handleAddAllToCart}>
            <FiShoppingBag size={16} /> Add All to Cart
          </button>

          <div className="wl-summary-info">
            <div className="wl-info-item">
              <FiHeart size={14} />
              <span>Wishlist items are saved locally</span>
            </div>
            <div className="wl-info-item">
              <FiShoppingBag size={14} />
              <span>Move items to cart when ready</span>
            </div>
          </div>

          <div className="wl-summary-note">
            <strong>💡 Pro Tip:</strong> Prices may change. Add items to cart to lock in the current price.
          </div>
        </aside>
      </div>
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default WishlistPage;
