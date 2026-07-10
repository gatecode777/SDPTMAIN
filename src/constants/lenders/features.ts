import { UserCheck, Zap, Layers, Cpu, Database, UserCog } from "lucide-react";

export interface LenderFeatureItem {
  title: string;
  description: string;
  iconName: string;
}

export const features: LenderFeatureItem[] = [
  {
    title: "Verified Borrowers",
    description: "Every borrower profile passes multiple identity, employment, and basic credit scoring checks before routing.",
    iconName: "UserCheck"
  },
  {
    title: "Real-Time Lead Delivery",
    description: "Inquiries are routed to your dashboard instantly, enabling fast response times and improved conversion rates.",
    iconName: "Zap"
  },
  {
    title: "Multi-Product Support",
    description: "Acquire high-intent customers for Personal, Business, Home, LAP, Education, Vehicle, and MSME loan products.",
    iconName: "Layers"
  },
  {
    title: "Smart Lead Distribution",
    description: "Dynamic routing rules map loan inquiries based on location, credit limits, and custom risk policies.",
    iconName: "Cpu"
  },
  {
    title: "CRM Ready Integration",
    description: "Instantly export borrower profiles via secure spreadsheets or sync leads directly to your internal LMS.",
    iconName: "Database"
  },
  {
    title: "Dedicated Account Manager",
    description: "A financial technology expert handles your onboarding, routing setups, policy updates, and reporting reviews.",
    iconName: "UserCog"
  }
];

export const lenderFeaturesIconMap: Record<string, any> = {
  UserCheck,
  Zap,
  Layers,
  Cpu,
  Database,
  UserCog
};

