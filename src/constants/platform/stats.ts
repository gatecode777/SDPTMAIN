export interface PlatformStatItem {
  value: string;
  label: string;
  description: string;
}

export const stats: PlatformStatItem[] = [
  { value: "100K+", label: "Transactions Processed", description: "Successfully routed payments and balance updates" },
  { value: "99.99%", label: "Platform Availability", description: "Uptime guarantee backed by operational SLAs" },
  { value: "20+", label: "Business Modules", description: "Configurable tools ready for sandbox deployment" },
  { value: "256-bit", label: "Enterprise Security", description: "Military-grade data protection algorithms" }
];
