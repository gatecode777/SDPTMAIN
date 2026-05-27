"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Slider.css";

const slides = [
  {
    title: "Unleash\nGaming Power",
    desc: "High-performance gaming PCs with RTX graphics and ultra-fast processors.",
    img: "/images/pc.webp",
    accent: "GAMING SERIES",
  },
  {
    title: "Build Your\nDream PC",
    desc: "Custom rigs designed for creators, gamers, and professionals.",
    img: "/images/pc2.webp",
    accent: "CUSTOM BUILDS",
  },
  {
    title: "Next Gen\nPerformance",
    desc: "Experience lightning speed with SSD, DDR5 RAM, and advanced cooling.",
    img: "/images/pc3.webp",
    accent: "NEW ARRIVALS",
  },
  {
    title: "Ultimate\nStreaming Setup",
    desc: "Dominate your stream with multi-core processors and extreme multitasking capabilities.",
    img: "/images/streaming_setup_pc.png",
    accent: "STREAMING READY",
  },
  {
    title: "Professional\nWorkstations",
    desc: "Accelerate your workflow with powerhouse workstations tailored for heavy rendering.",
    img: "/images/workstation_pc.png",
    accent: "WORKSTATIONS",
  },
  {
    title: "Esports\nDomination",
    desc: "Gain the competitive edge with ultra-high frame rates and zero lag performance.",
    img: "/images/esports_pc.png",
    accent: "ESPORTS READY",
  },
  {
    title: "Compact\nPowerhouses",
    desc: "Small form factor builds that pack a massive punch without taking up desk space.",
    img: "/images/mini_itx_pc.png",
    accent: "MINI-ITX BUILDS",
  },
  {
    title: "Water-Cooled\nPerfection",
    desc: "Stay icy cool under pressure with premium custom water-cooling loops.",
    img: "/images/water_cooled_pc.png",
    accent: "PREMIUM COOLING",
  },
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  useEffect(() => {
    const t = setInterval(() => {
      setDirection("next");
      setIndex((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number) => {
    setDirection(i > index ? "next" : "prev");
    setIndex(i);
  };

  const prev = () => {
    setDirection("prev");
    setIndex((p) => (p - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection("next");
    setIndex((p) => (p + 1) % slides.length);
  };

  return (
    <section className="hero">
      <div className="hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div className="hero-slide" key={i} style={{ position: "relative" }}>
            <Image 
              src={s.img} 
              alt={s.title.replace('\n', ' ')} 
              fill 
              style={{ objectFit: 'cover' }} 
              priority={i === 0} 
              sizes="100vw"
              quality={70}
            />
            <div className="hero-overlay"></div>
            <div className="hero-container">
              <div className="hero-content">
                <span className={`hero-accent ${i === index ? "animate" : ""}`}>{s.accent}</span>
                <h1 className={i === index ? "animate" : ""}>
                  {s.title.split("\n").map((line, idx) => (
                    <span key={idx}>{line}<br /></span>
                  ))}
                </h1>
                <p className={i === index ? "animate" : ""}>{s.desc}</p>
                <div className={`hero-btns ${i === index ? "animate" : ""}`}>
                  <Link href="/shop" className="hero-btn hero-btn--primary">
                    Shop Now <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button aria-label="Previous Slide" className="hero-arrow hero-arrow--left" onClick={prev} suppressHydrationWarning>
        <FiChevronLeft size={22} />
      </button>
      <button aria-label="Next Slide" className="hero-arrow hero-arrow--right" onClick={next} suppressHydrationWarning>
        <FiChevronRight size={22} />
      </button>

      <div className="hero-dots">
        {slides.map((_, i) => (
          <button aria-label={`Go to slide ${i + 1}`} key={i} className={`hero-dot ${i === index ? "active" : ""}`} onClick={() => goTo(i)} suppressHydrationWarning>
            <span className="hero-dot-fill"></span>
          </button>
        ))}
      </div>

      <div className="hero-counter">
        <span className="hero-counter-current">0{index + 1}</span>
        <span className="hero-counter-sep">/</span>
        <span className="hero-counter-total">0{slides.length}</span>
      </div>
    </section>
  );
};

export default HeroSlider;
