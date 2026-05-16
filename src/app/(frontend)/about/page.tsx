"use client";

import React from "react";
import Link from "next/link";
import { FiMonitor, FiCpu, FiShield, FiTruck, FiHeadphones, FiRefreshCw, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-tech">
      
      <section className="about-hero-tech">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="section-tag-white">Our Vision</span>
          <h1>Building the Ultimate<br />Custom PC Experiences</h1>
          <p>We blend passion, technical expertise, and an unwavering commitment to quality to bring your dream machines to life.</p>
        </div>
      </section>

      <section className="about-stats-tech">
        <div className="about-stats-inner">
          <div className="stat-card-tech">
            <span className="stat-value">2016</span>
            <span className="stat-label">Year Established</span>
          </div>
          <div className="stat-card-tech">
            <span className="stat-value">50k+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-card-tech">
            <span className="stat-value">100%</span>
            <span className="stat-label">Genuine Parts</span>
          </div>
          <div className="stat-card-tech">
            <span className="stat-value">4.9/5</span>
            <span className="stat-label">Average Rating</span>
          </div>
        </div>
      </section>

      <section className="about-story-tech">
        <div className="story-tech-inner">
          <div className="story-text">
            <span className="section-tag">Our Journey</span>
            <h2>Started in a Workshop, Now Serving India</h2>
            <p>Our journey began with a simple vision: to make high-end PC hardware accessible and understandable. From our first humble workshop in Jaipur to serving thousands across India, our core values have remained unchanged.</p>
            <p>We source directly from trusted global brands, ensuring every component meets our rigorous standards. It's not just about selling parts; it's about crafting a platform for your creativity and performance.</p>
            <div className="story-features">
              <div className="sf-item"><FiCheckCircle className="check-icon" /> Certified Technicians</div>
              <div className="sf-item"><FiCheckCircle className="check-icon" /> Authorized Dealers</div>
              <div className="sf-item"><FiCheckCircle className="check-icon" /> Nationwide Shipping</div>
            </div>
          </div>
          <div className="story-image-grid">
            <div className="image-stack">
              <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80" alt="PC Build" className="img-main" />
              <div className="glass-card">
                <span className="glass-val">8+</span>
                <span className="glass-lab">Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-features-grid">
        <div className="features-grid-inner">
          <div className="features-header">
            <span className="section-tag">The PC Store Promise</span>
            <h2>Quality is Our Priority</h2>
            <p>Our experienced technicians curate parts that are perfect for the system. They carefully analyze to ensure your machine runs flawlessly.</p>
          </div>
          <div className="agrid">
            <div className="agrid-card">
              <div className="agrid-icon"><FiCpu /></div>
              <h3>Genuine Hardware</h3>
              <p>Every part is sourced directly from authorized channels, ensuring full manufacturer warranties.</p>
            </div>
            <div className="agrid-card">
              <div className="agrid-icon"><FiMonitor /></div>
              <h3>Flawless Builds</h3>
              <p>Our experts meticulously assemble and test each system to guarantee peak performance.</p>
            </div>
            <div className="agrid-card">
              <div className="agrid-icon"><FiShield /></div>
              <h3>Secure & Reliable</h3>
              <p>From checkout to delivery, your data and components are protected at every stage.</p>
            </div>
            <div className="agrid-card">
              <div className="agrid-icon"><FiTruck /></div>
              <h3>Fast Delivery</h3>
              <p>Same-day dispatch on most orders. Enjoy secure Pan-India delivery within 2-5 days.</p>
            </div>
            <div className="agrid-card">
              <div className="agrid-icon"><FiHeadphones /></div>
              <h3>Expert Support</h3>
              <p>Our PC experts are available Mon–Sat to help you choose the right components.</p>
            </div>
            <div className="agrid-card">
              <div className="agrid-icon"><FiRefreshCw /></div>
              <h3>Easy Returns</h3>
              <p>7-day hassle-free return policy on unboxed products. We stand by our service.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-cta-tech">
        <div className="about-cta-inner">
          <h2>Ready to Build Your Dream PC?</h2>
          <p>Browse our full catalog or get expert advice from our team.</p>
          <div className="about-cta-btns">
            <Link href="/shop" className="abtn abtn--white">Shop Now <FiArrowRight /></Link>
            <Link href="/contact" className="abtn abtn--outline-white">Talk to an Expert</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
