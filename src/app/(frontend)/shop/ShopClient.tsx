"use client";

import React, { useState, useContext, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiFilter, FiSearch, FiGrid, FiList } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import { getProducts } from "@/actions/product";
import "./ShopPage.css";
import "@/components/frontend/Skeleton.css";
import dynamic from "next/dynamic";
import ProductCard from "@/components/frontend/shop/ProductCard";

const QuickViewModal = dynamic(() => import("@/components/frontend/shop/QuickViewModal"), { ssr: false });
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
  description?: string;
  images?: string[];
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

export default function ShopClient({
  initialProducts,
  categories,
  initialCat,
  initialQ,
}: {
  initialProducts: Product[];
  categories: Category[];
  initialCat: string;
  initialQ: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const isFirstMount = useRef(true);

  useEffect(() => {
    setSelectedCat(initialCat);
    setSearchTerm(initialQ);
  }, [initialCat, initialQ]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = showMobileFilter ? "hidden" : "";
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = "";
      }
    };
  }, [showMobileFilter]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    fetchProducts();
  }, [selectedCat, selectedPrice, sortBy, initialQ]);

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
      
      if (initialQ) {
        query.name = { $regex: initialQ, $options: "i" };
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
    router.push(`/shop?${params.toString()}`, { scroll: false });
    if (window.innerWidth <= 992) setShowMobileFilter(false);
  };

  const clearAllFilters = () => {
    setSelectedCat("All");
    setSelectedPrice(priceRanges[0]);
    setSearchTerm("");
    router.push('/shop', { scroll: false });
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

      <div className="shop-container" id="shop-catalog">
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
                        router.push(`/shop?${params.toString()}`, { scroll: false });
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
                  <ProductCard
                    key={product._id}
                    product={product as any}
                    isInWishlist={isInWishlist}
                    toggleWishlist={toggleWishlist}
                    addToCart={addToCart}
                    setSelectedProduct={setSelectedProduct}
                    setIsModalOpen={setIsModalOpen}
                    viewType={viewType}
                  />
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
}
