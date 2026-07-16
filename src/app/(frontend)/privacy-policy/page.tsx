"use client";

import React from "react";
import { FiShield, FiFileText, FiLock, FiEye, FiShare2, FiAlertCircle, FiMail, FiPhone, FiGlobe, FiInfo, FiCheckCircle } from "react-icons/fi";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-['Poppins'] pb-20">
      { }
      <div className="relative bg-[#0a0a0f] text-center overflow-hidden py-24 px-6 flex flex-col items-center justify-center min-h-[350px]">
        { }
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-90"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-6">
            <FiShield size={14} /> Security & Trust
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight font-['Albert_Sans']">Privacy Policy</h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto">
            Effective Date: January 01, 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 relative z-20 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

          <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed text-sm md:text-base">

            { }
            <div className="text-lg text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100 border-l-4 border-l-blue-500">
              <p className="mb-2">
                Welcome to <strong>SDPT Technologies Pvt. Ltd.</strong> (“SDPT”, “we”, “our”, or “us”).
                We value your privacy and are committed to protecting your personal information.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, and safeguard the information you provide while using our e-commerce platform. By accessing or using our website, you agree to the terms of this Privacy Policy.
              </p>
            </div>

            { }
            <section className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <FiFileText size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-['Albert_Sans']">1. Information We Collect</h2>
              </div>
              <p>We may collect the following types of information:</p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><FiInfo className="text-blue-500" /> Personal Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>Full Name & Email Address</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>Mobile Number</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>Billing & Shipping Address</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>Company Name & GST Info</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>Payment Details</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><FiEye className="text-indigo-500" /> Technical Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>IP Address & Browser Type</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>Device & Operating System</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>Website Usage Data</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>Cookies & Tracking Information</li>
                  </ul>
                </div>
              </div>
            </section>

            { }
            <section className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <FiCheckCircle size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-['Albert_Sans']">2. How We Use Your Information</h2>
              </div>
              <p>We use collected information for:</p>
              <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                {[
                  "Processing and delivering orders",
                  "Managing customer accounts",
                  "Providing customer support",
                  "Sending order updates and notifications",
                  "Improving website performance",
                  "Fraud prevention & security",
                  "Marketing communication (if permitted)",
                  "Compliance with legal obligations"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            { }
            <div className="grid md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <FiLock className="text-slate-700 text-xl" />
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">3. Payment Information</h2>
                </div>
                <p className="text-sm">
                  SDPT does not directly store your complete debit/credit card information. Payments are processed through secure third-party payment gateway providers that follow industry-standard security practices. We are not responsible for any issues arising from third-party systems.
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <FiEye className="text-slate-700 text-xl" />
                  <h2 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">4. Cookies Policy</h2>
                </div>
                <p className="text-sm">
                  Our website uses cookies to improve functionality, remember preferences, and analyze traffic. Users can disable cookies through browser settings, though some website features may not function properly.
                </p>
              </section>
            </div>

            { }
            <section className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                  <FiShare2 size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-['Albert_Sans']">5. Data Sharing & Security</h2>
              </div>
              <p>We do not sell or rent your personal information. We may share information with delivery partners, payment gateways, tech providers, and legal authorities when required.</p>
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl flex gap-4 mt-4">
                <FiAlertCircle className="text-amber-500 shrink-0 text-2xl" />
                <p className="text-sm text-amber-800">
                  We implement reasonable security measures to protect user information against unauthorized access, misuse, or alteration. However, despite our efforts, no online platform can guarantee 100% security.
                </p>
              </div>
            </section>

            { }
            <div className="grid md:grid-cols-2 gap-8 pt-4">
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">6. User Rights</h2>
                <p className="text-sm">You have the right to access your data, request corrections, request deletion (subject to legal obligations), and opt out of marketing communications.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">7. Third-Party Links</h2>
                <p className="text-sm">Our site contains links to external services. SDPT is not responsible for their privacy practices. Review their policies before sharing info.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">8. Children's Privacy</h2>
                <p className="text-sm">Our services are not for individuals under 18. We do not knowingly collect personal info from minors.</p>
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">9. Policy Changes</h2>
                <p className="text-sm">SDPT reserves the right to update this policy at any time without prior notice. Updates will be posted here.</p>
              </section>
            </div>

            { }
            <section className="mt-12 bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 font-['Albert_Sans']">10. Contact Information</h2>
                <p className="text-slate-300 mb-6">If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition-transform hover:-translate-y-1">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                      <FiMail size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Email</p>
                      <a href="mailto:info@sdpt.com" className="text-sm font-semibold hover:text-blue-400 transition-colors">info@sdpt.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition-transform hover:-translate-y-1">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                      <FiPhone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Phone</p>
                      <p className="text-sm font-semibold">+91 9845845554</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition-transform hover:-translate-y-1">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                      <FiGlobe size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Website</p>
                      <a href="https://sdpttech.com" target="_blank" rel="noreferrer" className="text-sm font-semibold hover:text-purple-400 transition-colors">sdpttech.com</a>
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
