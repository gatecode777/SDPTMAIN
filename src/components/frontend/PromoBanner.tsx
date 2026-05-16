"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiZap } from "react-icons/fi";
import "./PromoBanner.css";
import { getBanner } from "@/actions/banner";

const PromoBanner = () => {
  const [banner, setBanner] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  useEffect(() => {
    async function fetchBanner() {
      const data = await getBanner();
      if (data.success && data.banner.isActive) {
        setBanner(data.banner);
      }
    }
    fetchBanner();
  }, []);

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
          <img 
            src={banner.imageUrl || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80"} 
            alt="Promo Banner" 
            className="floating-img" 
          />
          <div className="promo-circle-bg"></div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
