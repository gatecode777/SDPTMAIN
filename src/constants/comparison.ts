export interface ComparisonFeature {
  name: string;
  free: boolean | string;
  starter: boolean | string;
  professional: boolean | string;
}

export const comparisonFeatures: ComparisonFeature[] = [
  { name: "Business Listing", free: true, starter: true, professional: true },
  { name: "Search Visibility", free: "Standard", starter: "Priority", professional: "Priority Placement" },
  { name: "AI Business Website", free: false, starter: true, professional: true },
  { name: "WhatsApp Bot Support", free: false, starter: true, professional: true },
  { name: "KYC Verified Badge", free: false, starter: false, professional: true },
  { name: "Custom Domain Support", free: false, starter: true, professional: true },
  { name: "API Access", free: false, starter: false, professional: true },
  { name: "White Label Dashboard", free: false, starter: false, professional: true }
];
