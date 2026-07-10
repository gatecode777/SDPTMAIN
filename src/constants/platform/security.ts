import { Key, ShieldCheck, FileText, CheckSquare, History, RefreshCw } from "lucide-react";

export interface SecurityFeatureItem {
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export const securityFeatures: SecurityFeatureItem[] = [
  {
    title: "Encrypted Data",
    description: "All client records and transaction logs are encrypted at rest with AES-256 and in transit using TLS 1.3.",
    iconName: "Key",
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Role-Based Access",
    description: "Strict credential parameters prevent unauthorized team members from accessing administrative details.",
    iconName: "ShieldCheck",
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Activity Logs",
    description: "Every profile adjustment, lead export, and balance modification is recorded inside unalterable tables.",
    iconName: "FileText",
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Compliance Ready",
    description: "Pre-configured schemas built to align with local banking guidelines, GST audits, and privacy rules.",
    iconName: "CheckSquare",
    color: "bg-amber-50 text-amber-600"
  },
  {
    title: "Comprehensive Audit Trail",
    description: "Trace payment cycles from initial deposits to disbursements with clear time-stamped history logs.",
    iconName: "History",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Backup & Recovery",
    description: "Continuous database backups and automated recovery setups guarantee total data protection.",
    iconName: "RefreshCw",
    color: "bg-teal-50 text-teal-600"
  }
];

export const securityIconMap: Record<string, any> = {
  Key,
  ShieldCheck,
  FileText,
  CheckSquare,
  History,
  RefreshCw
};
