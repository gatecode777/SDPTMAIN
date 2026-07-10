import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-gray-100">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-sm">
            <Link href="/" className="inline-block">
              <Image src={logo} alt="SDPT Logo" width={110} height={30} priority />
            </Link>
            <p className="text-sm text-[#666] leading-relaxed">
              India's premium verified marketplace connecting local businesses, service providers, and customers directly.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link href="/platform" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Platform
            </Link>
            <Link href="/lenders" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Lenders
            </Link>
            <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-full border border-gray-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-2.5 rounded-full border border-gray-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-[#666]">
          <span>
            © {new Date().getFullYear()} SDPT. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-blue-600 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
