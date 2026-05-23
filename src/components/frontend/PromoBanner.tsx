"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiZap } from "react-icons/fi";
import "./PromoBanner.css";
import "./Skeleton.css";
import { getBanner } from "@/actions/banner";

const PromoBanner = ({ initialBanner }: { initialBanner?: any }) => {
  const [banner, setBanner] = useState<any>(initialBanner || null);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  const [loading, setLoading] = useState(initialBanner ? false : true);

  useEffect(() => {
    if (initialBanner) return;
    async function fetchBanner() {
      const data = await getBanner();
      if (data.success && data.banner.isActive) {
        setBanner(data.banner);
      }
      setLoading(false);
    }
    fetchBanner();
  }, [initialBanner]);

  useEffect(() => {
    if (!banner || !banner.expiryDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(banner.expiryDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0")
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [banner]);

  if (loading) {
    return (
      <section className="promo-skeleton">
        <div className="promo-skeleton-container">
          <div className="promo-skeleton-content">
            <div className="promo-skeleton-badge" />
            <div className="promo-skeleton-title" />
            <div className="promo-skeleton-title" style={{ width: '55%' }} />
            <div className="promo-skeleton-text" />
            <div className="promo-skeleton-text" style={{ width: '70%' }} />
            <div className="promo-skeleton-actions">
              <div className="promo-skeleton-btn" />
              <div className="promo-skeleton-timer">
                {[...Array(4)].map((_, i) => <div className="promo-skeleton-timer-item" key={i} />)}
              </div>
            </div>
          </div>
          <div className="promo-skeleton-image" />
        </div>
      </section>
    );
  }

  if (!banner) return null;

  return (
    <section className="promo-banner">
      <div className="promo-container">
        <div className="promo-content">
          <div className="promo-badge">
            <FiZap /> {banner.badge}
          </div>
          <h2 className="promo-title">
            {banner.title}
          </h2>
          <p className="promo-text">
            {banner.description}
          </p>
          <div className="promo-actions">
            <Link href={banner.buttonLink || "/shop"} className="promo-btn-primary">
              {banner.buttonText} <FiArrowRight />
            </Link>
            <div className="promo-timer">
              <div className="timer-item">
                <span>{timeLeft.days}</span>
                <label>Days</label>
              </div>
              <div className="timer-item">
                <span>{timeLeft.hours}</span>
                <label>Hrs</label>
              </div>
              <div className="timer-item">
                <span>{timeLeft.minutes}</span>
                <label>Mins</label>
              </div>
              <div className="timer-item">
                <span>{timeLeft.seconds}</span>
                <label>Secs</label>
              </div>
            </div>
          </div>
        </div>
        <div className="promo-image">
          <Image 
            src={banner.imageUrl || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80"} 
            alt="Promo Banner" 
            fill
            className="floating-img" 
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="promo-circle-bg"></div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
