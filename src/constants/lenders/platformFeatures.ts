import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity, 
  Download, 
  Code, 
  PieChart, 
  Mail, 
  MessageSquare, 
  Lock 
} from "lucide-react";

export interface PlatformFeatureItem {
  title: string;
  description: string;
  iconName: string;
}

export const platformFeatures: PlatformFeatureItem[] = [
  {
    title: "Lead Dashboard",
    description: "A centralized dashboard to monitor borrower requests, credit scoring, and profile document links.",
    iconName: "LayoutDashboard"
  },
  {
    title: "Team Management",
    description: "Structure local branch managers, assign loan officer duties, and set monthly targets.",
    iconName: "Users"
  },
  {
    title: "Lead Notes",
    description: "Attach customized audit comments, credit verification details, and follow-up schedules.",
    iconName: "FileText"
  },
  {
    title: "Status Tracking",
    description: "Track leads through stages from initial verification to sanction and final loan disbursement.",
    iconName: "Activity"
  },
  {
    title: "Export Reports",
    description: "Download detailed CSV sheets for offline audit checks, analytics, and bulk CRM imports.",
    iconName: "Download"
  },
  {
    title: "API Ready Integration",
    description: "Deploy webhook parameters to trigger instant lead transmissions to your corporate LMS.",
    iconName: "Code"
  },
  {
    title: "Advanced Analytics",
    description: "Examine graphical charts indicating conversion rates, product ratios, and regional spikes.",
    iconName: "PieChart"
  },
  {
    title: "Email Notifications",
    description: "Receive immediate auto-alerts for high-value business or corporate working capital requests.",
    iconName: "Mail"
  },
  {
    title: "WhatsApp Alerts",
    description: "Direct instant borrower notification updates straight to your registered team mobile chats.",
    iconName: "MessageSquare"
  },
  {
    title: "Role Management",
    description: "Establish access protocols for data managers, risk assessors, and external compliance auditors.",
    iconName: "Lock"
  }
];

export const platformFeaturesIconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Download,
  Code,
  PieChart,
  Mail,
  MessageSquare,
  Lock
};
