import { 
  LayoutDashboard, 
  Bell, 
  UserCheck, 
  Cloud, 
  Database, 
  Zap, 
  Smartphone, 
  Code, 
  Blocks, 
  Lock 
} from "lucide-react";

export interface PlatformBenefitItem {
  title: string;
  description: string;
  iconName: string;
}

export const platformBenefits: PlatformBenefitItem[] = [
  {
    title: "Unified Dashboard",
    description: "Manage wallets, ledger records, and customer directories from a centralized screen.",
    iconName: "LayoutDashboard"
  },
  {
    title: "Real-Time Notifications",
    description: "Receive instant updates for client transactions and new high-intent loan requests.",
    iconName: "Bell"
  },
  {
    title: "Role-Based Access",
    description: "Assign customized dashboard parameters to compliance checkers, managers, and auditors.",
    iconName: "UserCheck"
  },
  {
    title: "Cloud Infrastructure",
    description: "Highly redundant cloud hosting guaranteeing sub-second responsiveness globally.",
    iconName: "Cloud"
  },
  {
    title: "Secure Data Storage",
    description: "Enterprise-grade database encryption protecting sensitive borrower and client details.",
    iconName: "Database"
  },
  {
    title: "Fast Performance",
    description: "Optimized server architecture ensuring instant lead routing and page load speeds.",
    iconName: "Zap"
  },
  {
    title: "Mobile Friendly",
    description: "Fully responsive layouts scaled to render seamlessly across all smartphones.",
    iconName: "Smartphone"
  },
  {
    title: "API-Ready Architecture",
    description: "Deploy secure webhooks to integrate platform leads into your proprietary LMS databases.",
    iconName: "Code"
  },
  {
    title: "Scalable Modules",
    description: "Toggle individual platform tools on or off depending on business scale.",
    iconName: "Blocks"
  },
  {
    title: "Enterprise Security",
    description: "Complete firewall rules, DDoS protection, and periodic safety audits standard.",
    iconName: "Lock"
  }
];

export const platformBenefitsIconMap: Record<string, any> = {
  LayoutDashboard,
  Bell,
  UserCheck,
  Cloud,
  Database,
  Zap,
  Smartphone,
  Code,
  Blocks,
  Lock
};
