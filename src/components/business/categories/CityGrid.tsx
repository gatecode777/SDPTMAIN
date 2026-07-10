import React from "react";
import { cities } from "@/constants/cities";
import SectionHeading from "@/components/business/SectionHeading";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function CityGrid() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Browse by City"
          title="Find businesses near you"
          subtitle="Quickly filter and browse verified service listings located in your home city."
        />

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {cities.map((city, index) => (
            <Link
              key={index}
              href={`/shop?city=${city.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200/80 rounded-xl bg-white text-slate-700 font-semibold text-[14px] hover:border-[#102E63] hover:text-[#102E63] hover:shadow-md hover:scale-105 transition-all duration-300 font-['Poppins'] cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{city.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
