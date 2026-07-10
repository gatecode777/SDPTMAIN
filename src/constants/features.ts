import { ShieldCheck, EyeOff, ThumbsUp } from "lucide-react";

export interface DirectoryFeatureItem {
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export const features: DirectoryFeatureItem[] = [
  {
    title: "Verified Businesses",
    description: "Only genuine businesses with valid PAN and GST registrations are approved to display their listing.",
    iconName: "ShieldCheck",
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Privacy First",
    description: "We protect your phone and email. Contact options are streamlined to block automated telemarketer spam.",
    iconName: "EyeOff",
    color: "bg-amber-50 text-amber-600"
  },
  {
    title: "Trusted Marketplace",
    description: "Built strictly around authentic customer reviews and ratings to highlight high-quality local brands.",
    iconName: "ThumbsUp",
    color: "bg-green-50 text-green-600"
  }
];

export const directoryFeaturesIconMap: Record<string, any> = {
  ShieldCheck,
  EyeOff,
  ThumbsUp
};
