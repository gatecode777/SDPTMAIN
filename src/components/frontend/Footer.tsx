"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import "./Footer.css";
import Image from "next/image";
import logo from "@/assets/logo.png";

const Footer = () => {
  const handleLinkClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="ft">
      <div className="ft-main">
        <div className="ft-main-inner">
          <div className="ft-col ft-col--brand">
            <Link href="/" className="ft-logo" onClick={handleLinkClick}>
              <Image src={logo} alt="SDTP Logo" className="ft-logo-img" width={120} height={32} />
            </Link>
            {/* <p className="ft-address"><FiMapPin size={14} /> Nanubhai Centre, Race Course Rd, Hari Nagar, Vadodara - 390007, Gujarat, India</p> */}
            <p className="ft-contact"><FiMail size={14} /> info@sdpt.com
            </p>
            {/* <p className="ft-contact"><FiPhone size={14} /> +91 984584555438</p> */}
            <div className="ft-socials">
              <a href="#" className="ft-social" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="ft-social" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="ft-social" aria-label="Twitter"><BsTwitterX /></a>
              <a href="#" className="ft-social" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          <div className="ft-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop?q=Graphics#shop-catalog">Graphics Cards</Link></li>
              <li><Link href="/shop?cat=Processor#shop-catalog">Processors</Link></li>
              <li><Link href="/shop?q=Motherboard#shop-catalog">Motherboards</Link></li>
              <li><Link href="/shop?cat=Storage#shop-catalog">RAM & Storage</Link></li>
              <li><Link href="/shop?cat=Peripherals#shop-catalog">Peripherals</Link></li>
              <li><Link href="/shop?cat=Monitor#shop-catalog">Gaming Monitors</Link></li>
            </ul>
          </div>

          <div className="ft-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about" onClick={handleLinkClick}>Our Story</Link></li>
              <li><Link href="/contact" onClick={handleLinkClick}>Contact Us</Link></li>
              <li><Link href="/account" onClick={handleLinkClick}>My Account</Link></li>
              <li><Link href="/cart" onClick={handleLinkClick}>Cart</Link></li>
              <li><Link href="/wishlist" onClick={handleLinkClick}>Wishlist</Link></li>
            </ul>
          </div>

          <div className="ft-col">
            <h4>Support</h4>
            <ul>
              <li><Link href="/privacy-policy" onClick={handleLinkClick}>Privacy Policy</Link></li>
              <li><Link href="/return-policy" onClick={handleLinkClick}>Return Policy</Link></li>
              <li><Link href="/terms-and-conditions" onClick={handleLinkClick}>Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
