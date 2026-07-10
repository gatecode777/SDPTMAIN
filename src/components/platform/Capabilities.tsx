import React from "react";
import Card from "@/components/business/Card";
import { CreditCard, Lock, BarChart2 } from "lucide-react";

export default function Capabilities() {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-24 md:space-y-32">
        
        {/* Capability 1: Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              Payments Engine
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight font-['Albert_Sans']">
              Payments Infrastructure
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed font-['Poppins']">
              Accept, track and reconcile payments with complete visibility. Our platform handles virtual deposits, executes double-entry validations, and automates vendor pay-outs directly through domestic bank tunnels.
            </p>
          </div>
          
          <div className="lg:col-span-6 flex justify-center">
            <Card hoverLift={false} className="w-full max-w-[420px] bg-slate-950/95 border border-white/10 p-6 shadow-xl text-white font-['Poppins'] animate-none">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-xs font-bold text-[#00B4D8]">RECONCILIATION GATEWAY</span>
                <span className="text-[10px] text-slate-500 font-mono">ID: PX-1029</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900 border border-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold block">GPay Inflow</span>
                      <span className="text-[9px] text-slate-500">Decantro virtual node</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-400">+₹10,500</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 pt-1">
                  <span>Reconciliation Status</span>
                  <span className="text-green-400 font-bold">✓ AUTO-MATCHED</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Capability 2: Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-last lg:order-first flex justify-center">
            <Card hoverLift={false} className="w-full max-w-[420px] bg-white border border-slate-200/80 p-6 shadow-xl text-slate-800 font-['Poppins']">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-bold text-[#102E63]">MEMBER ACCESS ROLES</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="text-xs font-bold block text-slate-900">Compliance Officer</span>
                    <span className="text-[9px] text-slate-400">Can verify GST & credit scores</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="text-xs font-bold block text-slate-900">DSA Sub-Agent</span>
                    <span className="text-[9px] text-slate-400">Can view assigned local leads only</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">RESTRICTED</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              Operations Control
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight font-['Albert_Sans']">
              Business Operations
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed font-['Poppins']">
              Manage customers, teams, documents and workflows from one dashboard. Set up role-based profiles, assign custom location guidelines to regional agents, and follow leads through stages of onboarding in real-time.
            </p>
          </div>
        </div>

        {/* Capability 3: Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              Security & Audit
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight font-['Albert_Sans']">
              Compliance & Security
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed font-['Poppins']">
              Built with audit trails, role-based permissions and verification workflows. We process employment verifications, check bureau limits automatically, and provide unalterable activity logs for compliance auditors.
            </p>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <Card hoverLift={false} className="w-full max-w-[420px] bg-slate-950/95 border border-white/10 p-6 shadow-xl text-white font-['Poppins']">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Audit Security Log</span>
              </div>
              <div className="space-y-2 text-[10px] font-mono text-slate-400">
                <p className="text-slate-500">[14:31:02] Lead export initiated by vikram@finroute.in</p>
                <p className="text-slate-500">[14:31:03] Webhook payload delivered successfully</p>
                <p className="text-green-400">[14:31:05] KYC document hash validation: MATCHED</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Capability 4: Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-last lg:order-first flex justify-center">
            <Card hoverLift={false} className="w-full max-w-[420px] bg-white border border-slate-200/80 p-6 shadow-xl text-slate-800 font-['Poppins']">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-bold text-[#102E63]">CONVERSION REPORT</span>
                <BarChart2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>Business Loan Approvals</span>
                    <span>88% Accuracy</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[88%] rounded-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>WhatsApp Lead Conversions</span>
                    <span>74% Accuracy</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00B4D8] h-full w-[74%] rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              Analytics Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight font-['Albert_Sans']">
              Reporting & Insights
            </h2>
            <p className="text-[15px] text-[#666] leading-relaxed font-['Poppins']">
              Visual dashboards and real-time reporting for better decision making. Monitor disbursal trends, transaction counts, and agent conversion scores with simplified, printable report exports ready for offline audits.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
