import { Wallet, BookOpen, Users, Target, Shield, LineChart } from "lucide-react";

export interface PlatformModuleItem {
  title: string;
  description: string;
  iconName: string;
}

export const platformModules: PlatformModuleItem[] = [
  {
    title: "Digital Wallet",
    description: "Accept virtual deposits, execute multi-party transfers, and monitor real-time balance sheets securely.",
    iconName: "Wallet"
  },
  {
    title: "Ledger Engine",
    description: "Financial double-entry ledger system built to record every operation with complete consistency.",
    iconName: "BookOpen"
  },
  {
    title: "CRM Directory",
    description: "Track customer profile logs, callback histories, and document verifications inside a clean directory.",
    iconName: "Users"
  },
  {
    title: "Lead Management",
    description: "Capture user queries, distribute leads via regional rules, and score borrower intent dynamically.",
    iconName: "Target"
  },
  {
    title: "Document Vault",
    description: "Upload and store encrypted registration documents, PAN/GST details, and KYC audits safely.",
    iconName: "Shield"
  },
  {
    title: "Analytics Dashboard",
    description: "Evaluate graphical charts showing regional trends, transaction volumes, and conversion metrics.",
    iconName: "LineChart"
  }
];

export const platformModulesIconMap: Record<string, any> = {
  Wallet,
  BookOpen,
  Users,
  Target,
  Shield,
  LineChart
};
