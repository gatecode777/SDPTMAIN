import React from "react";
import Card from "@/components/business/Card";
import { CheckCircle2, Check, Phone, CreditCard, Landmark, MapPin } from "lucide-react";

export default function LeadQuality() {
  const points = [
    { title: "Verified mobile numbers", desc: "Every enquiry is mobile OTP-validated to filter invalid numbers." },
    { title: "Basic eligibility checks", desc: "Income limits, age bounds, and self-reported bureau score minimums." },
    { title: "Duplicate lead filtering", desc: "We deduplicate submissions within a 30-day window." },
    { title: "Location targeting", desc: "Leads are mapped to your specific branch pin codes." },
    { title: "Source tracking", desc: "Identify lead sources like organic search or referrals." },
    { title: "Interest-based matching", desc: "Borrowers are connected based on their requested loan products." },
    { title: "High intent borrowers", desc: "No passive profiles — only active borrowers who requested callbacks." },
    { title: "Transparent reporting", desc: "Access comprehensive delivery reports on your dashboard." }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Verification Funnel Dashboard */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
            
            <Card hoverLift={false} className="w-full max-w-[380px] bg-slate-900 border border-white/10 p-6 shadow-2xl relative text-white font-['Poppins']">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Funnel</h4>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-center justify-between bg-slate-800/60 border border-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#00B4D8]" />
                    <span className="text-xs font-semibold">1. OTP Phone Vetted</span>
                  </div>
                  <Check className="w-4 h-4 text-green-400" />
                </div>

                {/* Step 2 */}
                <div className="flex items-center justify-between bg-slate-800/60 border border-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold">2. Bureau Score Check</span>
                  </div>
                  <Check className="w-4 h-4 text-green-400" />
                </div>

                {/* Step 3 */}
                <div className="flex items-center justify-between bg-slate-800/60 border border-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold">3. PAN & GST Verified</span>
                  </div>
                  <Check className="w-4 h-4 text-green-400" />
                </div>

                {/* Step 4 */}
                <div className="flex items-center justify-between bg-slate-800/60 border border-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-semibold">4. Target Zone Match</span>
                  </div>
                  <span className="text-[10px] text-green-400 font-bold">READY</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Features List */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              Quality Assurance
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight max-w-xl font-['Albert_Sans']">
              Why our leads convert better
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {points.map((pt, index) => (
                <div key={index} className="flex gap-3.5 items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-800 leading-tight mb-1">
                      {pt.title}
                    </h4>
                    <p className="text-xs text-[#666] leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
