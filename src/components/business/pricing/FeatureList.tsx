import React from "react";
import { Check } from "lucide-react";

interface FeatureListProps {
  features: string[];
  isFeatured?: boolean;
}

export default function FeatureList({ features, isFeatured = false }: FeatureListProps) {
  return (
    <ul className="space-y-4 mb-8 font-['Poppins']">
      {features.map((feat, index) => {
        const isParentInherit = feat.startsWith("Everything in");
        return (
          <li key={index} className="flex gap-3 text-[14px] text-slate-700 items-start">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 ${
              isFeatured 
                ? "bg-blue-50 border-blue-200 text-blue-600" 
                : "bg-green-50 border-green-200 text-green-600"
            }`}>
              <Check className="w-3.5 h-3.5 stroke-[3px]" />
            </span>
            <span className={isParentInherit ? "font-bold text-slate-900" : ""}>{feat}</span>
          </li>
        );
      })}
    </ul>
  );
}
