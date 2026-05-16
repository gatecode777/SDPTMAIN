"use client";

import React, { useState, useContext, useEffect, use } from "react";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiShield, FiTruck, FiRefreshCw, FiChevronRight } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import { getProductById } from "@/actions/product";
import "./ProductDetail.css";

interface Product {
  _id: string;
  name: string;
  offerPrice: number;
  mrp: number;
  thumbnail: string;
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
      <span key={i} className={i < Math.floor(rating) ? "star filled" : "star"}>★</span>
    ))}
    <span className="rating-num">({rating})</span>
  </div>
);

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>Product not found</h2>
        <p>We couldn't find the component you're looking for.</p>
        <Link href="/shop">Back to Shop</Link>
      </div>
    );
  }

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="pd-page">
      <div className="pd-breadcrumb">
        <div className="pd-container">
          <Link href="/">Home</Link> <FiChevronRight /> <Link href="/shop">Shop</Link> <FiChevronRight /> <span>{product.name}</span>
        </div>
      </div>

      <div className="pd-container pd-main-grid">
        <div className="pd-gallery">
          <div className="pd-main-img">
            {product.badge && <span className="pd-badge">{product.badge}</span>}
            <img src={product.thumbnail} alt={product.name} />
          </div>
        </div>

        <div className="pd-info">
          <span className="pd-category">{typeof product.category === 'object' ? product.category.name : "Hardware"}</span>
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-meta">
            <Stars rating={product.averageRating || 5} />
            <span className="pd-reviews">{product.totalReviews || 0} Customer Reviews</span>
            <span className="pd-stock">In Stock</span>
          </div>

          <div className="pd-price-wrap">
            <span className="pd-price">{fmt(product.offerPrice)}</span>
            {product.mrp > product.offerPrice && <span className="pd-old-price">{fmt(product.mrp)}</span>}
          </div>

          <p className="pd-short-desc">{product.shortDescription || product.description?.substring(0, 160) + "..."}</p>

          <div className="pd-actions">
            <div className="pd-qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button 
              className="pd-add-btn" 
              onClick={() => addToCart({
                id: product._id,
                name: product.name,
                price: product.offerPrice,
                img: product.thumbnail,
                qty
              })}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button 
              className={`pd-wish-btn ${isInWishlist(product._id) ? "active" : ""}`}
              onClick={() => toggleWishlist(product._id)}
            >
              <FiHeart />
            </button>
          </div>

          <div className="pd-trust-badges">
            <div className="tb-item"><FiShield /> <span>2 Year Warranty</span></div>
            <div className="tb-item"><FiTruck /> <span>Free Shipping</span></div>
            <div className="tb-item"><FiRefreshCw /> <span>30 Day Returns</span></div>
          </div>
        </div>
      </div>

      <div className="pd-tabs-section">
        <div className="pd-container">
          <div className="pd-tab-header">
            <button className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>Description</button>
            <button className={activeTab === "specs" ? "active" : ""} onClick={() => setActiveTab("specs")}>Specifications</button>
            <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>Reviews ({product.totalReviews || 0})</button>
          </div>
          <div className="pd-tab-content">
            {activeTab === "description" && (
              <div className="pd-desc">
                <div dangerouslySetInnerHTML={{ __html: product.description || "No description available." }} />
              </div>
            )}
            {activeTab === "specs" && (
              <div className="pd-specs">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
