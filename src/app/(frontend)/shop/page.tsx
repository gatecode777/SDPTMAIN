"use client";

import React, { useState, useContext, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiFilter, FiSearch, FiShoppingCart, FiHeart, FiEye, FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import "./ShopPage.css";
import "@/components/frontend/Skeleton.css";
import QuickViewModal from "@/components/frontend/shop/QuickViewModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  _id: string;
  name: string;
  offerPrice: number;
  mrp: number;
  thumbnail: string;
  category: any;
  status: string;
  averageRating?: number;
  totalReviews?: number;
  shortDescription?: string;
  discountPercentage?: number;
}

interface Category {
  _id: string;
  name: string;
}

const priceRanges = [
  { label: "All Prices", min: 0, max: 1000000 },
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹30,000", min: 10000, max: 30000 },
  { label: "₹30,000 - ₹60,000", min: 30000, max: 60000 },
  { label: "Over ₹60,000", min: 60000, max: 1000000 },
];

const ShopContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCat = searchParams.get("cat");
  const urlQ = searchParams.get("q");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(urlCat || "All");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState(urlQ || "");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    setSelectedCat(urlCat || "All");
    setSearchTerm(urlQ || "");
  }, [urlCat, urlQ]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCat, selectedPrice, sortBy, urlQ]);

  const fetchInitialData = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query: any = { status: "PUBLISHED" };
      
      if (selectedCat !== "All") {
        if (selectedCat.length === 24) {
          query.category = selectedCat;
        } else {
        
          const cat = categories.find(c => c.name.toLowerCase() === selectedCat.toLowerCase());
          if (cat) query.category = cat._id;
        }
      }
      
      if (urlQ) {
        query.name = { $regex: urlQ, $options: "i" };
      }

      query.offerPrice = { $gte: selectedPrice.min, $lte: selectedPrice.max };

      const data = await getProducts(query, 1, 50);
      
      let sortedProducts = [...data.products];
      if (sortBy === "low") sortedProducts.sort((a, b) => a.offerPrice - b.offerPrice);
      if (sortBy === "high") sortedProducts.sort((a, b) => b.offerPrice - a.offerPrice);
      if (sortBy === "rating") sortedProducts.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

      setProducts(sortedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCatChange = (catId: string) => {
    setSelectedCat(catId);
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "All") {
      params.delete("cat");
    } else {
      params.set("cat", catId);
    }
    router.push(`/shop?${params.toString()}`);
    if (window.innerWidth <= 992) setShowMobileFilter(false);
  };

  const clearAllFilters = () => {
    setSelectedCat("All");
    setSelectedPrice(priceRanges[0]);
    setSearchTerm("");
    router.push('/shop');
  };

  const fmt = (num: number) => "₹" + num.toLocaleString("en-IN");

  return (
    <div className="shop-page">

      {showMobileFilter && (
        <div className="filter-backdrop" onClick={() => setShowMobileFilter(false)}></div>
      )}

      <div className="shop-header">
        <div className="shop-header-content">
          <h1>{selectedCat !== "All" ? (categories.find(c => c._id === selectedCat)?.name || "Store") : "All Components"}</h1>
          <p>Showing {products.length} results</p>
        </div>
      </div>

      <div className="shop-container">
        <aside className={`shop-sidebar ${showMobileFilter ? "show" : ""}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
            <button className="close-filter" onClick={() => setShowMobileFilter(false)}>×</button>
          </div>

          <div className="filter-section">
            <div className="filter-section-header">
              <h4>Categories</h4>
            </div>
            <div className="filter-list">
              <button
                className={selectedCat === "All" ? "active" : ""}
                onClick={() => handleCatChange("All")}
              >
                <span>All Components</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  className={selectedCat === c._id ? "active" : ""}
                  onClick={() => handleCatChange(c._id)}
                >
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-header">
              <h4>Price Range</h4>
            </div>
            <div className="filter-list">
              {priceRanges.map((r, i) => (
                <button
                  key={i}
                  className={selectedPrice.label === r.label ? "active" : ""}
                  onClick={() => setSelectedPrice(r)}
                >
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-toolbar">
            <div className="toolbar-left">
              <button className="mobile-filter-btn" onClick={() => setShowMobileFilter(true)}>
                <FiFilter /> <span>Filters</span>
              </button>
              <div className="search-wrapper">
                <div className="search-box">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("q", searchTerm);
                        router.push(`/shop?${params.toString()}`);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="toolbar-right">
              <div className="sort-box">
                <Select value={sortBy} onValueChange={(val) => setSortBy(val || "featured")}>
                  <SelectTrigger className="w-[180px] rounded-full bg-[#f8fafc] border-[#e2e8f0]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="low">Price: Low to High</SelectItem>
                    <SelectItem value="high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Average Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="view-toggle">
                <button
                  className={viewType === "grid" ? "active" : ""}
                  onClick={() => setViewType("grid")}
                >
                  <FiGrid />
                </button>
                <button
                  className={viewType === "list" ? "active" : ""}
                  onClick={() => setViewType("list")}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="shop-skeleton-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div className="shop-skeleton-card" key={i}>
                  <div className="shop-skeleton-card-img skeleton-block" />
                  <div className="shop-skeleton-card-body">
                    <div className="shop-skeleton-card-cat skeleton-block" />
                    <div className="shop-skeleton-card-name skeleton-block" />
                    <div className="shop-skeleton-card-name-sm skeleton-block" />
                    <div className="shop-skeleton-card-stars skeleton-block" />
                    <div className="shop-skeleton-card-price skeleton-block" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`product-grid ${viewType}`}>
              {products.length > 0 ? (
                products.map((product) => (
                  <div className="pc" key={product._id}>
                    <div className="pc-img-wrap" onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} style={{ cursor: 'pointer', position: "relative" }}>
                      {product.discountPercentage !== undefined && product.discountPercentage > 0 && (
                        <span className="pc-badge">-{product.discountPercentage}%</span>
                      )}
                      <Image src={product.thumbnail || "/images/placeholder.png"} alt={product.name} fill className="pc-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" />
                      <div className="pc-overlay"></div>
                      <div className="pc-actions" onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="pc-action pc-action--cart" 
                          onClick={() => addToCart({
                            id: product._id,
                            name: product.name,
                            price: product.offerPrice,
                            img: product.thumbnail,
                            qty: 1
                          })} 
                          title="Add to Cart"
                        >
                          <FiShoppingCart size={16} />
                        </button>
                        <button 
                          className={`pc-action ${isInWishlist(product._id) ? "pc-action--liked" : ""}`} 
                          onClick={() => toggleWishlist(product._id)} 
                          title="Wishlist"
                        >
                          <FiHeart size={16} />
                        </button>
                        <button 
                          className="pc-action" 
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                          title="Quick view"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="pc-body" onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} style={{ cursor: 'pointer' }}>
                      <span className="pc-cat">{typeof product.category === 'object' ? product.category.name : "Hardware"}</span>
                      <h3 className="pc-name">{product.name}</h3>
                      <div className="pc-rating">
                        <div className="pc-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`bs-star ${i < Math.floor(product.averageRating || 5) ? "bs-star--filled" : ""}`}>★</span>
                          ))}
                        </div>
                        <span className="pc-reviews">({product.totalReviews || 0})</span>
                      </div>
                      <div className="pc-price-row">
                        <span className="pc-price">{fmt(product.offerPrice)}</span>
                        {product.mrp > product.offerPrice && (
                          <span className="pc-original">{fmt(product.mrp)}</span>
                        )}
                      </div>
                      {product.shortDescription && <p className="pc-desc">{product.shortDescription}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <h3>No components found</h3>
                  <p>Try adjusting your search or filters.</p>
                  <button onClick={clearAllFilters}>Reset All Filters</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <QuickViewModal 
        product={selectedProduct as any} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
