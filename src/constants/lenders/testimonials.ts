export interface LenderTestimonialItem {
  name: string;
  company: string;
  position: string;
  quote: string;
  avatarText: string;
}

export const testimonials: LenderTestimonialItem[] = [
  {
    name: "Rajesh Sen",
    company: "NeoGrowth Capital",
    position: "Head of Digital Partnerships",
    quote: "Our customer acquisition cost for business loans dropped by 35% within the first quarter of joining. The pre-verified GSTIN profiles save our underwriting team hours of manual verification.",
    avatarText: "RS"
  },
  {
    name: "Smita Deshmukh",
    company: "Axis Finance",
    position: "VP - Commercial Lending",
    quote: "The location-based routing is highly accurate. We successfully disbursed over ₹45Cr in working capital loans across tier-2 and tier-3 cities this year using these qualified merchant leads.",
    avatarText: "SD"
  },
  {
    name: "Vikram Malhotra",
    company: "FinRoute Advisors",
    position: "Managing Director",
    quote: "With over 120 loan agents processing requests, the dashboard role assignments and CSV exports are vital. Our average turnaround time has decreased from 5 days to 24 hours.",
    avatarText: "VM"
  }
];
