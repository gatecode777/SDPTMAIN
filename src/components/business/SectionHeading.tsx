import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  center = true
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 flex flex-col ${center ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left"}`}>
      {badge && (
        <span className="text-[13px] font-semibold text-blue-600 tracking-wider uppercase mb-3 bg-blue-50 px-3 py-1.5 rounded-full">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[18px] text-[#666] leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
