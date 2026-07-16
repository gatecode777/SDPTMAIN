"use client";

import React from "react";
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiTruck, FiDollarSign, FiClock, FiAlertCircle, FiMail, FiPhone, FiGlobe } from "react-icons/fi";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-['Poppins'] pb-20">
      { }
      <div className="relative bg-[#0a0a0f] text-center overflow-hidden py-24 px-6 flex flex-col items-center justify-center min-h-[350px]">
        { }
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1600&q=80')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-90"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-6">
            <FiRefreshCw size={14} /> Returns & Replacements
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight font-['Albert_Sans']">Refund & Return Policy</h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto">
            Effective Date: January 01, 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 relative z-20 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

          <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed text-sm md:text-base">

            { }
            <div className="text-center max-w-2xl mx-auto mb-4">
              <p className="text-lg text-slate-700">
                At <strong>SDPT Technologies Pvt. Ltd.</strong>, customer satisfaction is important to us. This policy explains the conditions under which returns, replacements, and refunds are accepted.
              </p>
            </div>

            { }
            <div className="grid md:grid-cols-2 gap-8">

              { }
              <section className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-200">
                    <FiClock size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-emerald-900 font-['Albert_Sans']">1. 7-Day Return Policy</h2>
                </div>
                <p className="text-emerald-800 text-sm mb-4">You may request a return or replacement within 7 days from delivery. To be eligible:</p>
                <ul className="space-y-2 text-sm text-emerald-900 font-medium">
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-emerald-500 mt-1 shrink-0" /> Product must be unused & original condition</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-emerald-500 mt-1 shrink-0" /> Must include original packaging & invoice</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-emerald-500 mt-1 shrink-0" /> No physical damage from misuse</li>
                  <li className="flex items-start gap-2"><FiCheckCircle className="text-emerald-500 mt-1 shrink-0" /> Request submitted within 7 days</li>
                </ul>
              </section>

              { }
              <section className="bg-blue-50 border border-blue-100 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-200">
                    <FiDollarSign size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-blue-900 font-['Albert_Sans']">2. Refund Process</h2>
                </div>
                <p className="text-blue-800 text-sm mb-4">Once returned product is received and inspected:</p>
                <ul className="space-y-2 text-sm text-blue-900 font-medium">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span> Approved refunds processed in 5–10 business days</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span> Credited to original payment method</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span> Shipping charges may be non-refundable</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span> SDPT reserves the right to reject invalid requests</li>
                </ul>
              </section>
            </div>

            { }
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="p-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 font-['Albert_Sans']">
                    <FiCheckCircle className="text-emerald-500" /> Eligible for Return
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div> Wrong product delivered</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div> Damaged product received</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div> Manufacturing defect</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div> Missing accessories or parts</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div> Product not matching description</li>
                  </ul>
                </div>
                <div className="p-8 bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 font-['Albert_Sans']">
                    <FiXCircle className="text-red-500" /> Non-Returnable Items
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 shrink-0"></div> Used or physically damaged products</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 shrink-0"></div> Damage due to improper handling</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 shrink-0"></div> Software, digital goods, or licenses</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 shrink-0"></div> Customized or special-order items</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 shrink-0"></div> Missing original packaging/invoice</li>
                    <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 shrink-0"></div> Requests made after 7 days</li>
                  </ul>
                </div>
              </div>
            </div>

            { }
            <div className="grid md:grid-cols-3 gap-6">
              <section className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FiRefreshCw className="text-indigo-500 text-2xl mb-3" />
                <h2 className="text-lg font-bold text-slate-900 mb-2 font-['Albert_Sans']">3. Replacements</h2>
                <p className="text-xs text-slate-600">Request a replacement instead of a refund if the product is defective, wrong item delivered, or damaged. Depends on stock availability.</p>
              </section>

              <section className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FiTruck className="text-orange-500 text-2xl mb-3" />
                <h2 className="text-lg font-bold text-slate-900 mb-2 font-['Albert_Sans']">4. Return Shipping</h2>
                <p className="text-xs text-slate-600">Customers may need to ship the product. We cover costs for damaged/incorrect items. Pack securely to avoid transit damage.</p>
              </section>

              <section className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FiAlertCircle className="text-purple-500 text-2xl mb-3" />
                <h2 className="text-lg font-bold text-slate-900 mb-2 font-['Albert_Sans']">5. Cancellations</h2>
                <p className="text-xs text-slate-600">Cancel before shipment confirmation. Once shipped, cancellations may not be accepted. Refunds follow provider timelines.</p>
              </section>
            </div>

            { }
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl flex gap-4">
              <FiAlertCircle className="text-amber-500 shrink-0 text-2xl" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">6. Important Notes</h3>
                <ul className="text-sm text-amber-800 space-y-1 list-disc pl-4">
                  <li>SDPT reserves the right to verify all return and refund claims.</li>
                  <li>Fraudulent or abusive refund requests may result in account suspension.</li>
                  <li>Product images may slightly vary from actual products due to display settings.</li>
                </ul>
              </div>
            </div>

            { }
            <section className="mt-12 bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Albert_Sans']">7. Contact Us</h2>
                <p className="text-slate-300 mb-6">For return, replacement, or refund assistance, please contact:</p>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                      <FiMail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Email</p>
                      <a href="mailto:info@sdpt.com" className="text-sm font-semibold hover:text-blue-400">info@sdpt.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                      <FiPhone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Phone</p>
                      <p className="text-sm font-semibold">+91 984584555438</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                      <FiGlobe size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Website</p>
                      <a href="https://sdpttech.com" target="_blank" rel="noreferrer" className="text-sm font-semibold hover:text-purple-400">sdpttech.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
