import { Type, Sparkles, Share2 } from "lucide-react";

export interface StepItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export const steps: StepItem[] = [
  {
    id: 1,
    title: "Enter your business name",
    description: "Provide your brand name, category, and location in just one click to start the setup process.",
    iconName: "Type"
  },
  {
    id: 2,
    title: "AI generates your website",
    description: "Our intelligence engine instantly designs a professional, high-speed custom website tailored for your business.",
    iconName: "Sparkles"
  },
  {
    id: 3,
    title: "Share your URL",
    description: "Publish your live web link, display your custom QR code, and start capturing direct customer inquiries.",
    iconName: "Share2"
  }
];

export const stepsIconMap: Record<string, any> = {
  Type,
  Sparkles,
  Share2
};
