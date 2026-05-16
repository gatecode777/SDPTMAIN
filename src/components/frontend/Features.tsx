import React from "react";
import { FiTruck, FiShield, FiHeadphones, FiCreditCard } from "react-icons/fi";
import "./Features.css";

const features = [
  {
    icon: <FiTruck />,
    title: "Free Shipping",
    desc: "On all orders over ₹5,000",
  },
  {
    icon: <FiShield />,
    title: "Secure Payment",
    desc: "100% protected payments",
  },
  {
    icon: <FiHeadphones />,
    title: "24/7 Support",
    desc: "Dedicated tech experts",
  },
  {
    icon: <FiCreditCard />,
    title: "Easy EMI",
    desc: "Available on all major banks",
  },
];

const Features = () => {
  return (
    <section className="features-bar">
      <div className="features-container">
        {features.map((f, i) => (
          <div className="feature-item" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-content">
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
