import { 
  Landmark, 
  Shield, 
  Home, 
  HeartPulse, 
  Scale, 
  Building2, 
  Laptop, 
  GraduationCap, 
  Car, 
  Compass, 
  Briefcase, 
  ShoppingBag 
} from "lucide-react";

export interface DirectoryCategoryItem {
  name: string;
  description: string;
  iconName: string;
  href: string;
}

export const categories: DirectoryCategoryItem[] = [
  {
    name: "Loans & Finance",
    description: "Connect with verified loan distributors, financial consultants, and planners.",
    iconName: "Landmark",
    href: "/shop?cat=loans"
  },
  {
    name: "Insurance",
    description: "Secure your family and assets with qualified life, health, and general insurance agents.",
    iconName: "Shield",
    href: "/shop?cat=insurance"
  },
  {
    name: "Property",
    description: "Find trusted real estate brokers, property managers, and valuation experts.",
    iconName: "Home",
    href: "/shop?cat=property"
  },
  {
    name: "Healthcare",
    description: "Reach verified local clinics, wellness consultants, diagnostic labs, and pharmacies.",
    iconName: "HeartPulse",
    href: "/shop?cat=healthcare"
  },
  {
    name: "Legal",
    description: "Consult with verified corporate lawyers, tax advocates, and civil attorneys.",
    iconName: "Scale",
    href: "/shop?cat=legal"
  },
  {
    name: "Banking",
    description: "Explore financial solutions from authorized banking partners and representatives.",
    iconName: "Building2",
    href: "/shop?cat=banking"
  },
  {
    name: "Technology",
    description: "Get custom software development, IT support, cloud hosting, and web designers.",
    iconName: "Laptop",
    href: "/shop?cat=technology"
  },
  {
    name: "Education",
    description: "Connect with verified tuition academies, language tutors, and career guides.",
    iconName: "GraduationCap",
    href: "/shop?cat=education"
  },
  {
    name: "Automobile",
    description: "Locate authorized car service centers, spare parts dealers, and detailing shops.",
    iconName: "Car",
    href: "/shop?cat=automobile"
  },
  {
    name: "Travel",
    description: "Plan your trip with verified travel agencies, cab operators, and tour guides.",
    iconName: "Compass",
    href: "/shop?cat=travel"
  },
  {
    name: "Professional Services",
    description: "Access audit advisors, business consultants, designers, and marketing experts.",
    iconName: "Briefcase",
    href: "/shop?cat=professional-services"
  },
  {
    name: "Retail",
    description: "Discover verified wholesalers, local hardware distributors, and online merchants.",
    iconName: "ShoppingBag",
    href: "/shop?cat=retail"
  }
];

export const directoryCategoryIcons: Record<string, any> = {
  Landmark,
  Shield,
  Home,
  HeartPulse,
  Scale,
  Building2,
  Laptop,
  GraduationCap,
  Car,
  Compass,
  Briefcase,
  ShoppingBag
};
