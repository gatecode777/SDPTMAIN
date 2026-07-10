export interface FAQItem {
  question: string;
  answer: string;
}

export const faq: FAQItem[] = [
  {
    question: "Is the platform cloud based?",
    answer: "Yes. Our systems are hosted on redundant cloud infrastructure (AWS/Google Cloud), ensuring sub-second response times, automated scalability, and 99.99% service uptime."
  },
  {
    question: "Can modules be enabled individually?",
    answer: "Absolutely. Our platform is completely modular. You can toggle specific tools (like the Ledger Engine, CRM profiles, or Document Vault) on or off depending on your business requirements."
  },
  {
    question: "Can I integrate existing software?",
    answer: "Yes. We offer secure REST APIs and low-latency webhook endpoints to sync transaction logs and customer details straight to systems like Salesforce, Zoho, or your in-house LMS."
  },
  {
    question: "Is my data secure?",
    answer: "Security is built into our core. All data is encrypted using AES-256 at rest, and all client interactions are processed through secure TLS 1.3 tunnels."
  },
  {
    question: "Can multiple team members use the platform?",
    answer: "Yes. With our built-in Role-Based Access Control (RBAC), you can create custom logins for credit officers, branch managers, developers, and compliance auditors."
  },
  {
    question: "Does it support mobile devices?",
    answer: "Yes. The entire platform dashboard, management tools, and client directories are designed to scale and render beautifully on all mobile browsers."
  }
];
