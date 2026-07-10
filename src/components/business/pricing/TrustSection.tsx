import React from "react";
import Link from "next/link";

export default function TrustSection() {
  return (
    <section className="py-8 bg-white text-center border-b border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <p className="text-xs md:text-[13px] text-[#666] leading-relaxed font-['Poppins']">
          Payments powered by Razorpay. Cancel anytime. No hidden fees.
        </p>
        <p className="text-xs md:text-[13px] text-[#666] mt-2 font-['Poppins']">
          Questions?{" "}
          <Link href="/contact" className="text-blue-600 font-semibold hover:underline cursor-pointer">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
