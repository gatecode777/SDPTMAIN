import React from "react";
import {
  FiMonitor, FiServer, FiUserCheck, FiClock
} from "react-icons/fi";
import "./Services.css";

const services = [
  {
    icon: <FiMonitor size={28} />,
    title: "Web Development",
    desc: "Custom web solutions to build your digital presence and drive business success.",
    accentClass: "accent-blue",
  },
  {
    icon: <FiServer size={28} />,
    title: "IT Support",
    desc: "Reliable technical support and troubleshooting to keep your operations running smoothly.",
    accentClass: "accent-green",
  },
  {
    icon: <FiUserCheck size={28} />,
    title: "IT Personal Services",
    desc: "Tailored IT consulting and personalized tech assistance for your unique needs.",
    accentClass: "accent-purple",
  },
  {
    icon: <FiClock size={28} />,
    title: "24 Hours Service",
    desc: "Round-the-clock availability ensuring your critical systems are always supported.",
    accentClass: "accent-orange",
  }
];

const Services = () => {
  return (
    <section className="svc">
      <div className="svc-container">
        <div className="svc-header">
          <span className="svc-label">Our Expertise</span>
          <h2 className="svc-title">IT Services</h2>
          <p className="svc-subtitle">
            We offer a range of IT services to help businesses thrive in the digital age. From web development to IT support, our expert team is dedicated to providing tailored solutions that meet your unique needs and drive success.
          </p>
        </div>

        <div className="svc-grid">
          {services.map((s, i) => (
            <div className={`svc-card ${s.accentClass}`} key={i}>
              <div className="svc-icon-wrap">
                {s.icon}
                <div className="svc-icon-ring"></div>
              </div>
              <div className="svc-card-content">
                <h3 className="svc-card-title">{s.title}</h3>
                <p className="svc-card-desc">{s.desc}</p>
                <div className="svc-card-line"></div>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="svc-stats">
          <div className="svc-stat">
            <span className="svc-stat-num">500+</span>
            <span className="svc-stat-label">Projects Delivered</span>
          </div>
          <div className="svc-stat-divider" />
          <div className="svc-stat">
            <span className="svc-stat-num">24/7</span>
            <span className="svc-stat-label">Technical Support</span>
          </div>
          <div className="svc-stat-divider" />
          <div className="svc-stat">
            <span className="svc-stat-num">99.9%</span>
            <span className="svc-stat-label">Uptime Guarantee</span>
          </div>
          <div className="svc-stat-divider" />
          <div className="svc-stat">
            <span className="svc-stat-num">100%</span>
            <span className="svc-stat-label">Client Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
