import { 
  User, 
  Briefcase, 
  Home, 
  Building, 
  GraduationCap, 
  Car, 
  Coins, 
  RefreshCw, 
  Building2, 
  CreditCard, 
  ArrowUpRight, 
  Cpu 
} from "lucide-react";

export interface LoanCategoryItem {
  title: string;
  description: string;
  iconName: string;
}

export const loanCategories: LoanCategoryItem[] = [
  {
    title: "Personal Loan",
    description: "Flexible financing options for salaried and professional borrow profiles.",
    iconName: "User"
  },
  {
    title: "Business Loan",
    description: "Unsecured business growth capital for expansion and operations.",
    iconName: "Briefcase"
  },
  {
    title: "Home Loan",
    description: "Housing finance solutions for property acquisition and renovation.",
    iconName: "Home"
  },
  {
    title: "Loan Against Property",
    description: "High-value loans against residential, commercial, or industrial collateral.",
    iconName: "Building"
  },
  {
    title: "Education Loan",
    description: "Student funding packages for domestic and global university courses.",
    iconName: "GraduationCap"
  },
  {
    title: "Vehicle Loan",
    description: "Lending options for personal passenger cars and commercial fleets.",
    iconName: "Car"
  },
  {
    title: "Gold Loan",
    description: "Instant gold pledge funding with competitive LTV ratios and tenures.",
    iconName: "Coins"
  },
  {
    title: "Working Capital",
    description: "Cash flow packages for micro traders, manufacturers, and merchants.",
    iconName: "RefreshCw"
  },
  {
    title: "MSME Loan",
    description: "Priority lending programs with GST or Udyam documentation.",
    iconName: "Building2"
  },
  {
    title: "Credit Card",
    description: "Pre-approved card applications for high-grade profiles.",
    iconName: "CreditCard"
  },
  {
    title: "Overdraft",
    description: "Flexible cash lines mapped directly to corporate bank accounts.",
    iconName: "ArrowUpRight"
  },
  {
    title: "Equipment Finance",
    description: "Specialized machinery and hardware loans for corporate users.",
    iconName: "Cpu"
  }
];

export const loanCategoriesIconMap: Record<string, any> = {
  User,
  Briefcase,
  Home,
  Building,
  GraduationCap,
  Car,
  Coins,
  RefreshCw,
  Building2,
  CreditCard,
  ArrowUpRight,
  Cpu
};
