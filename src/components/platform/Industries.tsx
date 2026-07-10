import React from "react";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";
import { 
  Building2, 
  Landmark, 
  UserCheck, 
  Shield, 
  Home, 
  HeartPulse, 
  ShoppingBag, 
  GraduationCap, 
  Briefcase, 
  Building 
} from "lucide-react";

export default function Industries() {
  const list = [
    { name: "Banks", desc: "Digital wallet allocation and automated ledger integrations.", icon: Landmark },
    { name: "NBFCs", desc: "Structured merchant loan distribution and KYC checks.", icon: Building2 },
    { name: "Loan Agents", desc: "Regional lead routing, CRM tracking, and disbursement tools.", icon: UserCheck },
    { name: "Insurance Advisors", desc: "Reconciliation models for policy premium records.", icon: Shield },
    { name: "Real Estate Firms", desc: "Property escrow directories and lead management.", icon: Home },
    { name: "Healthcare Clinics", desc: "Encrypted patient logs and clinic payment checkouts.", icon: HeartPulse },
    { name: "Retail Businesses", desc: "Vendor payout reconciliation and customer lists.", icon: ShoppingBag },
    { name: "Education Academies", desc: "Tuition fee ledger records and student balance tabs.", icon: GraduationCap },
    { name: "Professional Services", desc: "Audit trail logging, accounting, and role setups.", icon: Briefcase },
    { name: "MSMEs", desc: "Priority capital access and verified buyer pages.", icon: Building }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Target Industries"
          title="Who uses the platform"
          subtitle="Our modular financial ledger and wallet infrastructure supports retail and commercial businesses pan-India."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {list.map((item, index) => {
            const IconComp = item.icon;
            return (
              <Card 
                key={index}
                className="p-6 border border-slate-100 bg-white group flex flex-col justify-between animate-none"
              >
                <div>
                  <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl mb-4 w-fit group-hover:bg-[#102E63] group-hover:text-white transition-colors duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-900 mb-1.5 font-['Albert_Sans']">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#666] leading-relaxed font-['Poppins']">
                    {item.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
