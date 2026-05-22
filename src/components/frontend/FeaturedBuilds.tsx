import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import "./FeaturedBuilds.css";

const builds = [
  {
    title: "Gaming Beast",
    desc: "RTX 4080 + i7-14700K — Dominate every game at 4K Ultra",
    price: "From ₹1,89,999",
    img: "/images/pc.webp",
    tag: "MOST POPULAR",
  },
  {
    title: "Creator Pro",
    desc: "RTX 4070 Ti + Ryzen 9 — Built for 3D rendering & video editing",
    price: "From ₹1,49,999",
    img: "/images/pc2.webp",
    tag: "FOR CREATORS",
  },
];

const FeaturedBuilds = () => {
  return (
    <section className="feat">
      <div className="feat-container">
        <div className="feat-header">
          <span className="feat-label">Curated Builds</span>
          <h2 className="feat-title">Shop the Build</h2>
          <p className="feat-subtitle">Hand-picked configurations ready to perform out of the box</p>
        </div>
        <div className="feat-grid">
          {builds.map((b, i) => (
            <div className="feat-card" key={i}>
              <div className="feat-card-img" style={{ backgroundImage: `url(${b.img})` }}>
                <div className="feat-card-overlay"></div>
                <span className="feat-card-tag">{b.tag}</span>
                <div className="feat-card-content">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                  <span className="feat-card-price">{b.price}</span>
                  <Link href="/build-pc" className="feat-card-btn">
                    Configure Now <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBuilds;
