import React from "react";

const stats = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "5,000+", label: "Products Listed" },
  { value: "8+", label: "Years in Business" },
  { value: "99.2%", label: "Satisfaction Rate" },
];

const AboutStats = () => (
  <section className="about-stats">
    <div className="about-stats-inner">
      {stats.map((s, i) => (
        <div className="stat-card" key={i}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default AboutStats;
