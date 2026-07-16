"use client";

import React from "react";
import { FiFileText, FiShoppingBag, FiCreditCard, FiTruck, FiRefreshCw, FiShield, FiUser, FiAlertTriangle, FiMail, FiPhone, FiGlobe } from "react-icons/fi";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-['Poppins'] pb-20">
      { }
      <div className="relative bg-[#0a0a0f] text-center overflow-hidden py-24 px-6 flex flex-col items-center justify-center min-h-[350px]">
        { }
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-90"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-6">
            <FiFileText size={14} /> Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight font-['Albert_Sans']">Terms & Conditions</h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto">
            Effective Date: January 01, 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 relative z-20 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

          <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed text-sm md:text-base">

            { }
            <div className="text-lg text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100 border-l-4 border-l-indigo-500">
              <p className="mb-2">
                Welcome to <strong>SDPT Technologies Pvt. Ltd.</strong> (“SDPT”, “Company”, “we”, “our”, or “us”).
              </p>
              <p>
                These Terms & Conditions govern your access to and use of our e-commerce website, products, and services related to computer parts, hardware products, accessories, and technology solutions. By accessing or using our website, you agree to comply with these terms.
              </p>
            </div>

            { }
            <div className="grid md:grid-cols-2 gap-8">
              { }
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                    <FiUser size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">1. Website Usage</h2>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> You are at least 18 years old or using under supervision.</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> You will provide accurate and complete information.</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> You will not misuse the website for illegal activities.</li>
                  <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> You will not attempt to damage or hack the website.</li>
                </ul>
              </section>

              { }
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <FiShoppingBag size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">2. Products & Services</h2>
                </div>
                <p className="text-sm">We offer Computer Parts, Hardware, PCBs, and Accessories. All products are subject to availability.</p>
                <p className="text-sm font-medium text-slate-800">We reserve the right to:</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Modify prices or discontinue products</li>
                  <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Limit quantities or refuse orders</li>
                </ul>
              </section>

              { }
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                    <FiCreditCard size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">3. Pricing & Payments</h2>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Prices are subject to applicable taxes.</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Payments must use approved methods.</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> We are not responsible for bank/gateway failures.</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Orders process only after successful payment.</li>
                </ul>
              </section>

              { }
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                    <FiTruck size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">4. Shipping & Delivery</h2>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Timelines are estimated based on logistics.</li>
                  <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> We are not liable for courier delays or natural events.</li>
                  <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Customers must provide accurate info.</li>
                  <li className="flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> Extra charges may apply for certain locations.</li>
                </ul>
              </section>

              { }
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                    <FiRefreshCw size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">5. Returns & Refunds</h2>
                </div>
                <p className="text-sm">Subject to our Return Policy. Eligible only for incorrect, damaged, or defective products upon delivery.</p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <FiShield size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">6. Warranty Disclaimer</h2>
                </div>
                <p className="text-sm">Warranties are provided by manufacturers. SDPT does not independently guarantee compatibility or performance.</p>
              </section>
            </div>

            { }
            <div className="bg-slate-900 text-white p-8 rounded-2xl my-10 relative overflow-hidden">
              <FiAlertTriangle className="absolute -right-4 -bottom-4 text-[120px] text-white/5" />
              <div className="relative z-10 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-3 text-white font-['Albert_Sans']">7. User Accounts</h3>
                  <p className="text-sm text-slate-300">Users are responsible for credentials. We are not liable for unauthorized access or password misuse. We may suspend fraudulent accounts.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3 text-white font-['Albert_Sans']">8. Limitation of Liability</h3>
                  <p className="text-sm text-slate-300">SDPT is not liable for indirect damages, loss of profits, business interruptions, or technical downtime. Use of products is at your own risk.</p>
                </div>
              </div>
            </div>

            { }
            <div className="grid md:grid-cols-2 gap-8">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">9. Intellectual Property</h2>
                <p className="text-sm">All website content (logos, graphics, text, code) is the property of SDPT and may not be copied or reproduced without permission.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">10. Third-Party Services</h2>
                <p className="text-sm">We are not responsible for third-party tools, payment gateways, logistics, or external links and their privacy practices.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">11. Prohibited Activities</h2>
                <p className="text-sm">Fraud, malicious code, intellectual property violation, and unauthorized access are prohibited and may result in legal action.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">12. Privacy</h2>
                <p className="text-sm">Your use of the website is also governed by our Privacy Policy. By using our services, you consent to its terms.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">13. Changes to Terms</h2>
                <p className="text-sm">We may update these terms at any time without prior notice. Continued use of the website constitutes acceptance of revised terms.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">14. Governing Law</h2>
                <p className="text-sm">Disputes shall be governed by the laws of India and subject to courts in Rajasthan.</p>
              </section>
            </div>

            { }
            <section className="mt-12 bg-indigo-50 border border-indigo-100 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6 font-['Albert_Sans']">15. Contact Information</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Email</p>
                    <a href="mailto:info@sdpt.com" className="text-sm font-semibold hover:text-indigo-600 transition-colors">info@sdpt.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <FiPhone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Phone</p>
                    <p className="text-sm font-semibold">+91 984584555438</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <FiGlobe size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Website</p>
                    <a href="https://sdpttech.com" target="_blank" rel="noreferrer" className="text-sm font-semibold hover:text-indigo-600 transition-colors">sdpttech.com</a>
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
