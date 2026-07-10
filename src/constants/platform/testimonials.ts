export interface PlatformTestimonialItem {
  name: string;
  company: string;
  position: string;
  quote: string;
  avatarText: string;
}

export const testimonials: PlatformTestimonialItem[] = [
  {
    name: "Priyanjali Sen",
    company: "Vastra Retail",
    position: "Founder & CEO",
    quote: "We transitioned our merchant payout balance sheets to SDPT's ledger engine. Ledger reconciliation takes minutes instead of days, and double-entry safeguards have completely eliminated bookkeeping errors.",
    avatarText: "PS"
  },
  {
    name: "Harish Rao",
    company: "CredLink Consultants",
    position: "Head of Digital Ops",
    quote: "The CRM modules and real-time lead routing have significantly improved team productivity. Enquiries are pre-screened and assigned in seconds, lowering our average loan approval time by 40%.",
    avatarText: "HR"
  },
  {
    name: "Deepa Nair",
    company: "Zenith Capital",
    position: "VP - Institutional Alliances",
    quote: "Integrating the webhooks was remarkably simple. Real-time balance logs and audit histories push directly to our host banking CRM, maintaining complete data alignment across regions.",
    avatarText: "DN"
  }
];
