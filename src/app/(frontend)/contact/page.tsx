"use client";

import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheck } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./ContactPage.css";

const info = [
  { icon: <FiMail />, label: "Email Us", value: "info@sdpt.com", sub: "We reply within 2 hours" },
  // { icon: <FiPhone />, label: "Call Us", value: "+91 123 456 7890", sub: "Mon–Sat, 10AM – 7PM" },
  // { icon: <FiMapPin />, label: "Visit Us", value: "Nanubhai Centre, Race Course Rd, Hari Nagar, Vadodara - 390007", sub: "Gujarat, India" },
  { icon: <FiClock />, label: "Business Hours", value: "Mon – Sat: 10AM – 7PM", sub: "Sunday: Closed" },
];

import { submitQuery } from "@/actions/query";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return ""; // Phone is optional in this form

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "phone") {
      // Restrict typing to only digits and maximum 10 digits
      val = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm(prev => {
      const updated = { ...prev, [name]: val };

      // Real-time validation
      if (name === "email") {
        setErrors(err => ({ ...err, email: validateEmail(val) }));
      } else if (name === "phone") {
        setErrors(err => ({ ...err, phone: validatePhone(val) }));
      }

      return updated;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const emailErr = validateEmail(form.email);
    const phoneErr = validatePhone(form.phone);

    if (emailErr || phoneErr) {
      setErrors({ email: emailErr, phone: phoneErr });
      return;
    }

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
                <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <span className="form-error-msg">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group ${errors.phone ? "has-error" : ""}`}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.966980872515!2d73.15556601488415!3d22.293341548200305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x362c231381774687%3A0x38b91d2241e750db!2sNanubhai%20Centre!5e0!3m2!1sen!2sin!4v1753737511781!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SDPT Technologies Location"
        />
      </div>
    </div>
  );
};

export default ContactPage;
