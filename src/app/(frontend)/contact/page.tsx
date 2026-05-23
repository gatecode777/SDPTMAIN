"use client";

import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheck } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./ContactPage.css";

const info = [
  { icon: <FiMail />, label: "Email Us", value: "info@SDPT.com", sub: "We reply within 2 hours" },
  // { icon: <FiPhone />, label: "Call Us", value: "+91 123 456 7890", sub: "Mon–Sat, 10AM – 7PM" },
  { icon: <FiMapPin />, label: "Visit Us", value: "Capital Galleria, Sirsi Road", sub: "Jaipur, Rajasthan 302034" },
  { icon: <FiClock />, label: "Business Hours", value: "Mon – Sat: 10AM – 7PM", sub: "Sunday: Closed" },
];

import { submitQuery } from "@/actions/query";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitQuery(form);
    setLoading(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      alert(res.error || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="contact">
      <div className="contact-hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1600&q=80)` }}>
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-inner">
          <span className="ctag">Get in Touch</span>
          <h1>We'd Love to Hear From You</h1>
          <p>Have a question about a product, need help with a build, or want to track your order? Our team is here to help.</p>
        </div>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p className="cinfo-sub">Reach out through any of these channels and we'll get back to you as soon as possible.</p>

          <div className="cinfo-cards">
            {info.map((item, i) => (
              <div className="cinfo-card" key={i}>
                <div className="cinfo-icon">{item.icon}</div>
                <div>
                  <span className="cinfo-label">{item.label}</span>
                  <span className="cinfo-value">{item.value}</span>
                  <span className="cinfo-sub2">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="cinfo-social">
            <span>Follow Us</span>
            <div className="csocials">
              <a href="#" className="csoc"><FaFacebookF /></a>
              <a href="#" className="csoc"><FaInstagram /></a>
              <a href="#" className="csoc"><FaTwitter /></a>
              <a href="#" className="csoc"><FaYoutube /></a>
            </div>
          </div>
        </div>

        <div className="contact-form-wrap">
          {submitted ? (
            <div className="form-success">
              <div className="success-icon"><FiCheck size={32} /></div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Our team will contact you within 2 hours during business hours.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }} className="csend-again">
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send a Message</h2>
              <p className="form-sub">Fill out the form and we'll get back to you within 2 hours.</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Select a topic</option>
                    <option>Product Inquiry</option>
                    <option>Order Status</option>
                    <option>Return & Refund</option>
                    <option>PC Build Help</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Your Message *</label>
                <textarea
                  name="message"
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="csend-btn" disabled={loading}>
                {loading ? <span className="csend-loader" /> : <><FiSend size={16} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d75.78!3d26.91!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzM2LjAiTiA3NcKwNDYnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="PC Store Location"
        />
      </div>
    </div>
  );
};

export default ContactPage;
