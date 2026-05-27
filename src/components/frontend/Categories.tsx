"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiArrowUpRight } from "react-icons/fi";
import { getCategories } from "@/actions/category";
import "./Categories.css";
import "./Skeleton.css";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

const Categories = ({ initialCategories = [] }: { initialCategories?: Category[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(initialCategories.length === 0);

  useEffect(() => {
    if (initialCategories.length > 0) return;
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch categories";
        console.error("Categories fetch failed:", message);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, [initialCategories]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amt = 360;
    el.scrollTo({
      left: el.scrollLeft + (dir === "left" ? -amt : amt),
      behavior: "smooth",
    });
  };

  const defaultImages: Record<string, string> = {
    "Graphics Cards": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80",
    "Processors": "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80",
    "Motherboards": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "Monitors": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    "Peripherals": "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=600&q=80",
  };

  return (
    <>
      <div className="marquee-bar">
        <div className="marquee-track">
          <span>⚡ Spring Clearance Event: Save Up to 70%</span>
          <span>🖥️ Build Your Dream PC Today</span>
          <span>🔧 Free Assembly on Custom Builds</span>
          <span>🆕 New Components Just Dropped</span>
          <span>🚚 Free Shipping on Orders Over ₹5000</span>
          <span>⚡ Spring Clearance Event: Save Up to 70%</span>
          <span>🖥️ Build Your Dream PC Today</span>
          <span>🔧 Free Assembly on Custom Builds</span>
          <span>🆕 New Components Just Dropped</span>
          <span>🚚 Free Shipping on Orders Over ₹5000</span>
        </div>
      </div>

      <section className="categories">
        <div className="categories-inner">
          <div className="cat-header">
            <div className="cat-header-left">
              <span className="cat-label">Browse Collection</span>
              <h2 className="cat-title">Shop by Components</h2>
            </div>
            <div className="cat-header-right">
              <button aria-label="Scroll left" className="cat-arrow" onClick={() => scroll("left")} suppressHydrationWarning><FiChevronLeft size={18} /></button>
              <button aria-label="Scroll right" className="cat-arrow" onClick={() => scroll("right")} suppressHydrationWarning><FiChevronRight size={18} /></button>
            </div>
          </div>

          <div className="cat-scroll" ref={ref}>
            <div className="cat-track">
              {loading ? (
                <div className="cat-skeleton-track">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div className="cat-skeleton-card skeleton-block" key={i} />
                  ))}
                </div>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <Link href={`/shop?cat=${cat._id}#shop-catalog`} className="cat-card" key={cat._id}>
                    <div className="cat-card-img" style={{ position: "relative" }}>
                      <Image 
                        src={cat.image || defaultImages[cat.name] || "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80"} 
                        alt={cat.name} 
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 250px"
                      />
                    </div>
                    <div className="cat-card-info">
                      <span className="cat-card-name">{cat.name}</span>
                      <span className="cat-card-count">Explore Category</span>
                    </div>
                  </Link>
                ))
              ) : null}
              <Link href="/shop" className="cat-card cat-card--discover">
                <div className="cat-card-discover-inner">
                  <h4>Discover All<br />Components</h4>
                  <div className="cat-card-discover-btn">
                    <FiArrowUpRight size={20} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Categories;
