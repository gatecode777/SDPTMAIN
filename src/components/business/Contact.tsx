"use client";

import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import Button from "./Button";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    message: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = { fullName: "", email: "", phone: "", businessName: "", message: "" };

    // Full Name: Length >= 3, alphabetic characters + spaces only
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters long.";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Name should only contain letters and spaces.";
      valid = false;
    }

    // Business Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Phone Number validation: Starts with 6, 7, 8, 9 and has exactly 10 digits
    let cleanedPhone = formData.phone.replace(/\D/g, "");
    if (cleanedPhone.length === 12 && cleanedPhone.startsWith("91")) {
      cleanedPhone = cleanedPhone.slice(2);
    } else if (cleanedPhone.length === 11 && cleanedPhone.startsWith("0")) {
      cleanedPhone = cleanedPhone.slice(1);
    }

    if (cleanedPhone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      valid = false;
    } else if (!/^[6-9]/.test(cleanedPhone)) {
      newErrors.phone = "Phone number must start with 6, 7, 8, or 9.";
      valid = false;
    }

    // Business Name validation
    if (formData.businessName.trim().length < 2) {
      newErrors.businessName = "Business name must be at least 2 characters long.";
      valid = false;
    }

    // Message Details validation
    if (formData.message.trim().length < 10) {
      newErrors.message = "Please enter at least 10 characters for details.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Contact Us"
          title="Talk to the marketplace team."
          subtitle="Have questions about verification, listings, or upgrading? We're here to help."
        />

        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-sm font-bold text-lg">
                ✓
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Albert_Sans']">Message Received</h3>
              <p className="text-xs text-[#475569] max-w-sm mx-auto font-['Poppins'] leading-relaxed">
                Thank you for contacting us! Your message has been successfully submitted. Our team will review the details and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-gray-50 pb-4 mb-2">
                Tell us what you're looking for
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[15px] transition-all"
                  />
                  {errors.fullName && (
                    <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.fullName}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Business Email *</label>
                  <input 
                    type="type" 
                    placeholder="name@company.com" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[15px] transition-all"
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone *</label>
                  <input 
                    type="tel" 
                    placeholder="+91 00000 00000" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[15px] transition-all"
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.phone}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Business Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acme Services" 
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[15px] transition-all"
                  />
                  {errors.businessName && (
                    <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.businessName}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Message Details *</label>
                <textarea 
                  rows={4}
                  placeholder="How can we help your business?"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-200/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-[15px] transition-all resize-none"
                />
                {errors.message && (
                  <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.message}</span>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="orange" className="w-full">
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
