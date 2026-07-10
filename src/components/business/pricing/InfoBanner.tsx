import React from "react";
import Card from "@/components/business/Card";

export default function InfoBanner() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-16 bg-white">
      <Card 
        hoverLift={false} 
        className="bg-blue-50/40 border border-blue-100/40 px-8 py-5 rounded-2xl max-w-2xl mx-auto text-center shadow-sm"
      >
        <p className="text-[13px] sm:text-[14px] text-slate-700 font-medium leading-relaxed font-['Poppins']">
          Every paid plan includes a free 1-month <strong className="text-blue-600">SDPT BOS trial</strong> — your full business dashboard with invoicing, CRM, payroll, and more.
        </p>
      </Card>
    </div>
  );
}
