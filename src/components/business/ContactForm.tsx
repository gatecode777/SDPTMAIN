"use client";

import React from "react";
import Card from "./Card";

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully! Thank you.");
  };

  return (
    <Card hoverLift={false} className="bg-slate-50 p-8 border border-slate-100 rounded-3xl">
      <form className="space-y-4 text-xs font-['Poppins']" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-500 block mb-1.5">YOUR NAME</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Amit Kumar" 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white" 
            />
          </div>
          <div>
            <label className="font-bold text-slate-500 block mb-1.5">EMAIL ADDRESS</label>
            <input 
              type="email" 
              required 
              placeholder="e.g. amit@gmail.com" 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white" 
            />
          </div>
        </div>
        <div>
          <label className="font-bold text-slate-500 block mb-1.5">MESSAGE</label>
          <textarea 
            rows={3} 
            required 
            placeholder="Write your query here..." 
            className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white resize-none" 
          />
        </div>
        <button type="submit" className="brand-btn-primary font-bold px-6 py-3 rounded-xl cursor-pointer">
          Send Message
        </button>
      </form>
    </Card>
  );
}
