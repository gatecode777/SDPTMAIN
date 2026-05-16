"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return (
    <div style={{ padding: "40px" }}>
      <h2>Search Results for "{q}"</h2>
      <p>Please use the <a href="/shop">Shop Page</a> for advanced filtering and results.</p>
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
