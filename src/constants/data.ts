import {
  Home,
  Briefcase,
  HeartPulse,
  Truck,
  Car,
  Zap,
  Sparkles,
  GraduationCap,
  Laptop,
  Package,
  Utensils,
  Palette,
  CheckCircle,
  FileCheck,
  PhoneCall,
  Search,
  Star,
  Globe,
  PlusCircle,
  QrCode,
  FileText,
  CreditCard
} from "lucide-react";

export const stats = [
  { value: "1,274+", label: "Verified Businesses" },
  { value: "12", label: "Service Categories" },
  { value: "380+", label: "Cities Covered" },
  { value: "4.6 ★", label: "Average Rating" }
];

export const categories = [
  { name: "Home Services", iconName: "Home" },
  { name: "Professional", iconName: "Briefcase" },
  { name: "Healthcare", iconName: "HeartPulse" },
  { name: "Logistics", iconName: "Truck" },
  { name: "Automotive", iconName: "Car" },
  { name: "Electrical", iconName: "Zap" },
  { name: "Salon & Wellness", iconName: "Sparkles" },
  { name: "Education", iconName: "GraduationCap" },
  { name: "IT & Software", iconName: "Laptop" },
  { name: "Packers & Movers", iconName: "Package" },
  { name: "Food & Catering", iconName: "Utensils" },
  { name: "Creative Services", iconName: "Palette" }
];

export const features = [
  {
    title: "Free Forever",
    description: "No monthly subscription fees, lead commissions, or hidden charges. List your business completely free.",
    iconName: "PlusCircle",
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "PAN/GST Verification",
    description: "Get verified using government registrations like PAN or GST to instantly establish client trust.",
    iconName: "FileCheck",
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Direct Owner Contact",
    description: "Connect directly with customers. No brokers or system-intercepted messages—deal on your own terms.",
    iconName: "PhoneCall",
    color: "bg-amber-50 text-amber-600"
  },
  {
    title: "SEO Optimized Listings",
    description: "Our pages are structured for maximum speed and indexing, ensuring you rank higher on Google search results.",
    iconName: "Search",
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Verified Reviews",
    description: "Review submission is restricted to authentic buyers, keeping spam out and maintaining absolute review integrity.",
    iconName: "Star",
    color: "bg-red-50 text-red-600"
  },
  {
    title: "Website Upgrade Option",
    description: "Instantly turn your marketplace profile page into a standalone, lightning-fast custom domain website.",
    iconName: "Globe",
    color: "bg-indigo-50 text-indigo-600"
  }
];

export const steps = [
  {
    id: 1,
    title: "Tell us about your business",
    description: "Fill in your profile with operational details, images, categories, and business hours in under 3 minutes."
  },
  {
    id: 2,
    title: "Verify identity",
    description: "Submit standard government documents (PAN or GST) for automated review to display your verified badge."
  },
  {
    id: 3,
    title: "Receive customer inquiries",
    description: "Start receiving direct calls, WhatsApp messages, and quote inquiries without any broker commissions."
  }
];

export const testimonials = [
  {
    name: "Rohan Mehta",
    location: "Mumbai",
    role: "IT & Software Provider",
    quote: "SDPT helped us double our service leads within 3 months. The verified badge made a huge difference in building client trust right from the first interaction."
  },
  {
    name: "Priya Patel",
    location: "Bengaluru",
    role: "Home Services Expert",
    quote: "Listing my cleaning agency was free and took less than 3 minutes. The SEO visibility is incredibly powerful—we rank on Google without spending on ads!"
  },
  {
    name: "Amit Kumar",
    location: "Delhi",
    role: "Automotive Repair Shop",
    quote: "Direct customer inquiries with no commissions or hidden fees. It is by far the most profitable local business marketplace we have ever used."
  }
];

export const faqs = [
  {
    question: "Is listing my business really free?",
    answer: "Yes, listing your business on SDPT is completely free forever. There are no monthly subscription fees, signup costs, or commissions charged on your incoming leads."
  },
  {
    question: "How does identity verification work?",
    answer: "We verify business identities using PAN card or GST registration details. Once submitted in your profile dashboard, our team reviews it within 24 hours to award the orange 'Verified' badge."
  },
  {
    question: "Can customers contact me directly?",
    answer: "Absolutely. All customer inquiries go directly to your designated email or phone number. We do not block, intercept, or mask direct communication channels."
  },
  {
    question: "What is the Website Upgrade option?",
    answer: "You can instantly upgrade your listing profile into a fully premium standalone landing page. This includes custom domain mapping, unique layouts, and specialized contact form widgets."
  },
  {
    question: "How does review moderation work?",
    answer: "To prevent spam and fake entries, review submission requires email verification. We also monitor for IP irregularities to maintain high trust levels on business reviews."
  }
];

export const products = [
  {
    logoName: "QrCode",
    name: "Business Listing",
    description: "Start your journey with a verified profile page to get found by thousands of local customers.",
    cta: "Create Listing"
  },
  {
    logoName: "FileText",
    name: "Invoice & Billing",
    description: "Create, share, and track professional GST compliant invoices and client payments instantly.",
    cta: "Generate Invoices"
  },
  {
    logoName: "Globe",
    name: "Smart Website",
    description: "Convert your listing profile into a modern, lightning-fast personal brand website in a single click.",
    cta: "Upgrade Website"
  },
  {
    logoName: "CreditCard",
    name: "Credit & Funding",
    description: "Access unsecured business credit lines and vendor financing options through verified lenders.",
    cta: "Apply For Funding"
  }
];

export const iconMap: Record<string, any> = {
  Home,
  Briefcase,
  HeartPulse,
  Truck,
  Car,
  Zap,
  Sparkles,
  GraduationCap,
  Laptop,
  Package,
  Utensils,
  Palette,
  CheckCircle,
  FileCheck,
  PhoneCall,
  Search,
  Star,
  Globe,
  PlusCircle,
  QrCode,
  FileText,
  CreditCard
};
