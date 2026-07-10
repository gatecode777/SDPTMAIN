export interface FAQItem {
  question: string;
  answer: string;
}

export const faq: FAQItem[] = [
  {
    question: "How do I become a lending partner?",
    answer: "Click on 'Become a Lending Partner' and submit your corporate details. A partnerships manager will contact you within 24 hours to verify your RBI license, DSA certificate, or bank authorization details."
  },
  {
    question: "How are leads verified?",
    answer: "Every lead passes through automated mobile OTP verification, duplicate checks, basic bureau eligibility limits, and Udyam/GST verification checks before dashboard distribution."
  },
  {
    question: "Can I choose cities?",
    answer: "Yes. You have complete control to target specific states, cities, or individual ZIP codes to align lead routing with your local branch network."
  },
  {
    question: "Do you provide exclusive leads?",
    answer: "Yes, we support both shared and exclusive lead options. Exclusive leads are mapped to a single financial institution to ensure high touchpoint conversion rates."
  },
  {
    question: "How is pricing calculated?",
    answer: "We support a pay-as-you-go model on a per-lead basis, alongside monthly subscription packages for enterprise partners. Pricing varies by loan product and verification depth."
  },
  {
    question: "Can I integrate my CRM?",
    answer: "Yes. We support low-latency webhook integrations to deliver JSON lead payloads directly to systems like Salesforce, LeadSquared, Zoho, or your proprietary LMS."
  },
  {
    question: "Is there a monthly commitment?",
    answer: "No. Starter plans have no minimum monthly commit constraints. Enterprise clients can secure custom bulk discounts with monthly SLA guarantees."
  },
  {
    question: "How quickly will I receive leads?",
    answer: "Immediately upon account verification and profile routing configuration, incoming borrower queries matching your filter parameters will route to your dashboard in real-time."
  }
];
