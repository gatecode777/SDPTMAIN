"use client";

import React from "react";
import { Search } from "lucide-react";
import Button from "@/components/business/Button";

export default function SearchBar() {
  return (
    <form 
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
    >
      <div className="flex-1 flex items-center gap-3 px-4 py-2 sm:py-0">
        <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input 
          type="text"
          placeholder="Search business, category or city..."
          className="w-full outline-none border-none text-slate-800 text-[15px] placeholder-slate-400 bg-transparent font-['Poppins']"
        />
      </div>
      <Button 
        type="submit" 
        variant="primary" 
        className="bg-[#102E63] hover:bg-[#0a1f44] text-white px-8 py-3.5"
      >
        Search
      </Button>
    </form>
  );
}
