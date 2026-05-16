import React from "react";
import "./Brands.css";

import { SiNvidia, SiAmd, SiIntel, SiAsus, SiCorsair, SiRazer, SiLogitech, SiSamsung } from "react-icons/si";

const brands = [
  { name: "NVIDIA", icon: <SiNvidia size={44} />, color: "#76B900" },
  { name: "AMD", icon: <SiAmd size={44} />, color: "#ED1C24" },
  { name: "Intel", icon: <SiIntel size={44} />, color: "#0071C5" },
  { name: "ASUS", icon: <SiAsus size={44} />, color: "#00539B" },
  { name: "Corsair", icon: <SiCorsair size={44} />, color: "#111" },
  { name: "Logitech", icon: <SiLogitech size={44} />, color: "#00B8FC" },
  { name: "Razer", icon: <SiRazer size={44} />, color: "#00FF00" },
  { name: "Samsung", icon: <SiSamsung size={44} />, color: "#1428A0" },
];

const Brands = () => {
  return (
    <section className="brands">
      <div className="brands-container">
        <div className="brands-header">
          <span className="brands-badge">Our Partners</span>
          <h2>Trusted By Industry Leaders</h2>
        </div>
      <div className="brands-marquee">
        <div className="brands-track">
          {[...brands, ...brands].map((b, i) => (
            <div className="brand-item" key={i} style={{ '--brand-color': b.color } as any}>
              <div className="brand-icon-wrap">
                {b.icon}
              </div>
              <span className="brand-label">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default Brands;
