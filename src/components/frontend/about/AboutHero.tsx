import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

const AboutHero = () => (
  <section className="about-hero">
    <div className="about-hero-inner">
      <span className="section-tag">About Us</span>
      <h1>Jaipur's Most Trusted<br />PC Component Store</h1>
      <p>We're a team of PC enthusiasts and engineers dedicated to bringing you the best hardware at honest prices since 2016.</p>
      <div className="about-hero-btns">
        <Link href="/shop" className="abtn abtn--dark">Browse Products <FiArrowRight /></Link>
        <Link href="/contact" className="abtn abtn--outline">Contact Us</Link>
      </div>
    </div>
    <div className="about-hero-img" style={{ position: "relative", minHeight: "300px" }}>
      <Image 
        src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80" 
        alt="PC Components" 
        fill
        style={{ objectFit: "cover", borderRadius: "12px" }}
      />
    </div>
  </section>
);

export default AboutHero;
