"use client";

import { useState } from "react";
import Image from "next/image";
import "./HelpForm.css";

export default function HelpForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert(`Thank you, ${form.name || "there"}! We'll call you back soon.`);
  };

  return (
    <div className="page-wrapper">
      <div className="form-container-img" style={{ position: "relative", minHeight: "300px" }}>
        <Image 
          src="/Image/needhelp_img.jpg" 
          alt="Need Help"
          fill
          style={{ objectFit: "cover", borderRadius: "12px" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="form-container-blog">
        <h1 className="card-title">Need Help?</h1>
        <p className="card-subtitle">Fill the Form Below</p>

        <input
          className="input-field"
          type="text"
          name="name"
          placeholder="Enter Your Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="input-field"
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          className="input-field"
          type="text"
          name="location"
          placeholder="Your Location"
          value={form.location}
          onChange={handleChange}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Request A Call Back
        </button>
      </div>
    </div>
  );
}
