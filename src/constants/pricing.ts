export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
}

export const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "mo",
    description: "Ideal for fresh startups and single-location local businesses.",
    features: [
      "1 Page local business website",
      "Standard SDPT Subdomain",
      "WhatsApp button leads",
      "Basic lead tracking analytics",
      "GST / PAN verified profile badge"
    ],
    cta: "Get Started"
  },
  {
    name: "Pro",
    price: "₹199",
    period: "mo",
    description: "Perfect for scaling brands that want full custom branding.",
    features: [
      "Everything in Free",
      "Remove SDPT branding entirely",
      "Premium custom domain mapping",
      "Advanced analytics dashboard",
      "Unlimited customer reviews & widgets",
      "SEO optimization tools & meta controls",
      "Priority email support"
    ],
    cta: "Get Started Pro",
    isPopular: true
  },
  {
    name: "Business",
    price: "₹499",
    period: "mo",
    description: "Designed for established companies managing multi-store listings.",
    features: [
      "Everything in Pro",
      "Multiple store locations mapping",
      "Custom Lead Capture forms & APIs",
      "Multi-user staff management dashboard",
      "Dedicated account success manager",
      "AI service page auto-copywriter"
    ],
    cta: "Get Started Business"
  }
];

export const pricingPagePlans: PricingPlan[] = [
  {
    name: "FREE",
    price: "₹0",
    period: "forever",
    description: "Ideal for individual stores and local business listings.",
    features: [
      "1 business listing",
      "Basic business info",
      "Claim flow & verification",
      "Directory search visibility",
      "SDPT Business badge"
    ],
    cta: "Claim Your Listing"
  },
  {
    name: "STARTER",
    price: "₹999",
    period: "per year",
    description: "Best for growing businesses wanting a professional web presence.",
    features: [
      "Everything in Free",
      "AI-generated business website",
      "WhatsApp bot for enquiries",
      "Monthly analytics dashboard",
      "Priority directory placement",
      "1-month SDPT BOS trial"
    ],
    cta: "Get Started",
    isPopular: true
  },
  {
    name: "PROFESSIONAL",
    price: "₹5,999",
    period: "per year",
    description: "For corporate brands needing white label tools and analytics.",
    features: [
      "Everything in Starter",
      "Priority search placement",
      "KYC Verified badge",
      "Lead CRM tools",
      "Custom domain support",
      "1-month SDPT BOS trial"
    ],
    cta: "Get Started"
  }
];

