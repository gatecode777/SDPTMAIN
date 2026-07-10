"use client";

import React, { useState } from "react";
import Button from "@/components/business/Button";
import Card from "@/components/business/Card";

export default function CTA() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    product: "Business Loans"
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = { fullName: "", email: "", phone: "" };

    // Full Name: Length >= 3, alphabetic characters + spaces only
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters long.";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Name should only contain letters and spaces.";
      valid = false;
    }

    // Company Email validation
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
    <section id="lender-signup" className="py-24 bg-[#102E63] text-white relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.1),transparent_40%)]" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-4 right-12 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Left Column - Heading */}
          <div className="lg:col-span-6 text-left space-y-6">
            <h2 className="text-3xl md:text-[42px] font-bold tracking-tight text-white leading-tight font-['Albert_Sans']">
              Ready to grow your lending business?
            </h2>
            <p className="text-slate-300 max-w-md text-base md:text-[16px] leading-relaxed font-['Poppins']">
              Join leading financial institutions already using our platform to acquire high-quality, pre-screened borrowers. Complete the partner application form and our onboarding officer will contact you.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1">✓ No setup fees</span>
              <span className="flex items-center gap-1">✓ CRM integration support</span>
              <span className="flex items-center gap-1">✓ Custom filtering</span>
            </div>
          </div>

          {/* Right Column - Partner Sign Up Form */}
          <div className="lg:col-span-6">
            <Card hoverLift={false} className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xl text-slate-800">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-sm font-bold text-lg">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Albert_Sans']">Application Received</h3>
                  <p className="text-xs text-[#475569] max-w-xs mx-auto font-['Poppins'] leading-relaxed">
                    Thank you for applying! Your application has been successfully submitted. Our team will review the details and contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-['Poppins']">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 font-['Albert_Sans']">Partner Application</h3>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">FULL NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rajesh Sen"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#102E63] text-slate-800 bg-white"
                    />
                    {errors.fullName && (
                      <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">COMPANY EMAIL</label>
                      <input 
                        type="email" 
                        required
                        placeholder="rajesh@neogrowth.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#102E63] text-slate-800 bg-white"
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.email}</span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">PHONE NUMBER</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#102E63] text-slate-800 bg-white"
                      />
                      {errors.phone && (
                        <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1.5">LOAN PRODUCT INTEREST</label>
                    <select 
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#102E63] text-slate-800 bg-white"
                    >
                      <option>Business Loans</option>
                      <option>Working Capital</option>
                      <option>Personal Loans</option>
                      <option>Home Loans / LAP</option>
                      <option>Equipment / MSME Finance</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="bg-[#102E63] hover:bg-[#0a1f44] text-white w-full font-bold py-3.5 shadow-md shadow-[#102E63]/10 mt-6 cursor-pointer"
                  >
                    Submit Application
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
