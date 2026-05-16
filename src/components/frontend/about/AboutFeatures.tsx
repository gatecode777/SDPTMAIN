import React from "react";
import { FiCpu, FiTruck, FiShield, FiHeadphones, FiMonitor, FiRefreshCw } from "react-icons/fi";

const features = [
  { icon: <FiCpu />, title: "Genuine Products", desc: "Every product is sourced directly from authorized distributors with full warranty." },
  { icon: <FiTruck />, title: "Fast Delivery", desc: "Same-day dispatch on orders placed before 2PM. Pan-India delivery in 2–5 days." },
  { icon: <FiShield />, title: "Secure Shopping", desc: "100% secure checkout with SSL encryption and multiple payment options." },
  { icon: <FiHeadphones />, title: "Expert Support", desc: "Our PC experts are available Mon–Sat to help you choose the right components." },
  { icon: <FiMonitor />, title: "Build Service", desc: "Free PC assembly service on custom builds with cable management included." },
  { icon: <FiRefreshCw />, title: "Easy Returns", desc: "7-day hassle-free return policy on all products. No questions asked." },
];

const AboutFeatures = () => (
  <section className="about-features">
    <div className="about-features-inner">
      <div className="about-features-header">
        <span className="section-tag">Why Choose Us</span>
        <h2>The PC Store Difference</h2>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div className="feat-card" key={i}>
            <div className="feat-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutFeatures;
