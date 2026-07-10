"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Lucide from "lucide-react";
import ContactForm from "./ContactForm";

// Helper to safely load dynamic Lucide Icons
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Lucide as any)[name] || Lucide.Sparkles;
  return <IconComponent className={className} />;
}

// Curated high-resolution category imagery pool to guarantee stunning, dynamic photography
const getCategoryImages = (category: string) => {
  const normalized = category.toLowerCase().trim();
  
  if (normalized.includes("dentist") || normalized.includes("dental") || normalized.includes("teeth")) {
    return {
      hero: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("restaurant") || normalized.includes("food") || normalized.includes("cafe") || normalized.includes("bakery") || normalized.includes("dining")) {
    return {
      hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("estate") || normalized.includes("property") || normalized.includes("house") || normalized.includes("home") || normalized.includes("realtor") || normalized.includes("apartment")) {
    return {
      hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("law") || normalized.includes("legal") || normalized.includes("lawyer") || normalized.includes("attorney") || normalized.includes("court")) {
    return {
      hero: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1505664194779-8bebcb95c539?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("finance") || normalized.includes("bank") || normalized.includes("invest") || normalized.includes("wealth") || normalized.includes("tax") || normalized.includes("accountant")) {
    return {
      hero: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("gym") || normalized.includes("fitness") || normalized.includes("workout") || normalized.includes("crossfit") || normalized.includes("sport") || normalized.includes("athlete")) {
    return {
      hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("travel") || normalized.includes("tour") || normalized.includes("trip") || normalized.includes("agency") || normalized.includes("destination") || normalized.includes("holiday")) {
    return {
      hero: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("salon") || normalized.includes("beauty") || normalized.includes("hair") || normalized.includes("spa") || normalized.includes("makeup") || normalized.includes("cosmetic")) {
    return {
      hero: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1527799863830-de5a4d0694b9?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("hospital") || normalized.includes("clinic") || normalized.includes("medical") || normalized.includes("doctor") || normalized.includes("health") || normalized.includes("care")) {
    return {
      hero: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1504813184591-015578c77ef5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1582750433449-64c656df174f?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("education") || normalized.includes("school") || normalized.includes("class") || normalized.includes("college") || normalized.includes("university") || normalized.includes("academy") || normalized.includes("learn")) {
    return {
      hero: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("automobile") || normalized.includes("car") || normalized.includes("vehicle") || normalized.includes("drive") || normalized.includes("auto") || normalized.includes("motor")) {
    return {
      hero: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  if (normalized.includes("construction") || normalized.includes("building") || normalized.includes("builder") || normalized.includes("develop") || normalized.includes("architect")) {
    return {
      hero: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
      about: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      cta: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80"
      ]
    };
  }
  
  return {
    hero: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
    ]
  };
};

const isColorDark = (hex: string) => {
  if (!hex || !hex.startsWith("#")) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq < 128;
};

interface SiteTemplateProps {
  website: any;
}

export default function SiteTemplate({ website }: SiteTemplateProps) {
  const content = website.generatedContent || {};
  const brand = content.brand || {
    colors: {
      primary: website.themeColors?.primary || "#102E63",
      secondary: website.themeColors?.secondary || "#00B4D8",
      accent: website.themeColors?.accent || "#00B4D8",
      background: "#0F172A",
      surface: "#1E293B",
      cardBackground: "#1E293B",
      border: "#334155",
      text: "#F8FAFC"
    },
    typography: {
      headingFont: "Albert Sans",
      bodyFont: "Poppins"
    },
    borderRadius: "16px",
    shadowStyle: "shadow-lg",
    spacingScale: "comfortable",
    heroLayout: "split",
    animationPreset: "fade"
  };

  const isDark = !!website.darkMode;
  
  const getThemeColors = () => {
    const generatedColors = brand.colors || {};
    const primary = generatedColors.primary || website.themeColors?.primary || "#102E63";
    const secondary = generatedColors.secondary || website.themeColors?.secondary || "#00B4D8";
    const accent = generatedColors.accent || website.themeColors?.accent || "#00B4D8";
    let bg = generatedColors.background || (isDark ? "#0B0F19" : "#FFFFFF");
    let surface = generatedColors.surface || (isDark ? "#111827" : "#F8FAFC");
    let cardBg = generatedColors.cardBackground || (isDark ? "#1F2937" : "#FFFFFF");
    let border = generatedColors.border || (isDark ? "#374151" : "#E2E8F0");
    let text = generatedColors.text || (isDark ? "#F9FAFB" : "#0F172A");

    const bgIsDark = isColorDark(bg);
    const textIsDark = isColorDark(text);

    if (!isDark) {
      // Force Light Mode contrast safety
      if (bgIsDark) {
        bg = "#FFFFFF";
        surface = "#F8FAFC";
        cardBg = "#FFFFFF";
        border = "#E2E8F0";
      }
      if (!textIsDark) {
        text = "#0F172A";
      }
      return {
        primary,
        secondary,
        accent,
        background: bg,
        surface,
        cardBackground: cardBg,
        border,
        text,
        textMuted: "#475569"
      };
    } else {
      // Force Dark Mode contrast safety
      if (!bgIsDark) {
        bg = "#0B0F19";
        surface = "#111827";
        cardBg = "#1F2937";
        border = "#374151";
      }
      if (textIsDark) {
        text = "#F9FAFB";
      }
      return {
        primary,
        secondary,
        accent,
        background: bg,
        surface,
        cardBackground: cardBg,
        border,
        text,
        textMuted: "#9CA3AF"
      };
    }
  };

  const themeColors = getThemeColors();

  const sections = content.sections || [];
  const imgs = getCategoryImages(website.businessCategory);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");

  // Dynamic Google Fonts Loader
  useEffect(() => {
    if (brand.typography?.headingFont || brand.typography?.bodyFont) {
      const fonts = [];
      if (brand.typography.headingFont) {
        fonts.push(`family=${brand.typography.headingFont.replace(/\s+/g, "+")}:wght@400;600;700;800;900`);
      }
      if (brand.typography.bodyFont) {
        fonts.push(`family=${brand.typography.bodyFont.replace(/\s+/g, "+")}:wght@300;400;500;600`);
      }
      
      const linkId = "dynamic-google-fonts";
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?${fonts.join("&")}&display=swap`;
    }
  }, [brand.typography]);

  // Framer Motion Animation Presets mapping
  const getAnimationVariants = (): any => {
    if (website.animations === "None") {
      return {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0 } }
      };
    }
    const preset = brand.animationPreset || "fade";
    if (preset === "slide") {
      return {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
      };
    }
    if (preset === "scale") {
      return {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
      };
    }
    if (preset === "float") {
      return {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
      };
    }
    // Default: fade
    return {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };
  };

  const animVariants = getAnimationVariants();

  // Spacing scale calculation
  const getSpacingClass = (type: "padding" | "margin") => {
    const scale = brand.spacingScale || "comfortable";
    if (scale === "compact") return type === "padding" ? "py-12" : "my-6";
    if (scale === "loose") return type === "padding" ? "py-32" : "my-16";
    return type === "padding" ? "py-24" : "my-10"; // comfortable default
  };

  const cardRadiusClass = () => {
    const rad = brand.borderRadius || "16px";
    if (rad === "0px") return "rounded-none";
    if (rad === "8px") return "rounded-lg";
    if (rad === "24px") return "rounded-[32px]";
    return "rounded-2xl"; // default 16px
  };

  return (
    <div 
      className="min-h-screen antialiased relative overflow-hidden"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
        fontFamily: brand.typography?.bodyFont || "Poppins, sans-serif",
      }}
    >
      {/* Brand Style CSS Variable Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .heading-font {
          font-family: '${brand.typography?.headingFont || "Albert Sans"}', sans-serif;
        }
        .brand-bg-primary { background-color: ${themeColors.primary}; }
        .brand-text-primary { color: ${themeColors.primary}; }
        .brand-border-primary { border-color: ${themeColors.primary}; }
        
        .brand-bg-secondary { background-color: ${themeColors.secondary}; }
        .brand-text-secondary { color: ${themeColors.secondary}; }
        
        .brand-bg-accent { background-color: ${themeColors.accent}; }
        .brand-text-accent { color: ${themeColors.accent}; }
        
        .brand-card-bg { background-color: ${themeColors.cardBackground}; }
        .brand-border { border-color: ${themeColors.border}; }
        .brand-text-muted { color: ${themeColors.textMuted}; }
        
        .brand-btn-primary {
          background-color: ${themeColors.primary};
          color: #ffffff !important;
          border-radius: ${brand.borderRadius};
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .brand-btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px ${themeColors.primary}50;
        }
        .brand-btn-secondary {
          background-color: ${themeColors.secondary};
          color: #ffffff !important;
          border-radius: ${brand.borderRadius};
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .brand-btn-secondary:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px ${themeColors.secondary}50;
        }
        .text-gradient {
          background: linear-gradient(135deg, ${themeColors.text} 40%, ${themeColors.secondary} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Dynamic Theme Contrast Overrides */
        .text-white { color: ${themeColors.text} !important; }
        .text-slate-100 { color: ${isDark ? '#f1f5f9' : '#0f172a'} !important; }
        .text-slate-200 { color: ${isDark ? '#e2e8f0' : '#1e293b'} !important; }
        .text-slate-300 { color: ${isDark ? '#cbd5e1' : '#334155'} !important; }
        .text-slate-400 { color: ${isDark ? '#94a3b8' : '#475569'} !important; }
        .text-slate-500 { color: ${isDark ? '#64748b' : '#64748b'} !important; }
        .text-slate-600 { color: ${isDark ? '#475569' : '#94a3b8'} !important; }
        .brand-text-muted { color: ${themeColors.textMuted} !important; }
        
        /* Layout background overrides */
        .bg-white\\/5 {
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)'} !important;
        }
        .bg-slate-800 {
          background-color: ${isDark ? '#1e293b' : '#f1f5f9'} !important;
        }
        .bg-slate-900\\/30 {
          background-color: ${isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)'} !important;
        }
        .bg-slate-900\\/60 {
          background-color: ${isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)'} !important;
        }
        .bg-slate-950\\/80 {
          background-color: ${isDark ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.85)'} !important;
        }
        .hover\\:bg-slate-700:hover {
          background-color: ${isDark ? '#334155' : '#cbd5e1'} !important;
        }
        .hover\\:bg-white\\/5:hover {
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)'} !important;
        }
        .border-slate-800 {
          border-color: ${isDark ? '#1e293b' : '#e2e8f0'} !important;
        }
        .border-slate-700 {
          border-color: ${isDark ? '#334155' : '#cbd5e1'} !important;
        }
        .text-slate-800 {
          color: ${isDark ? '#1e293b' : '#f1f5f9'} !important;
        }

        /* Retain bright colors inside dark buttons/blocks */
        .brand-btn-primary,
        .brand-btn-secondary,
        .brand-bg-primary *,
        .brand-bg-secondary *,
        .bg-emerald-500 *,
        .bg-slate-950 * {
          color: #ffffff !important;
        }
        .brand-bg-primary .text-slate-300,
        .brand-bg-secondary .text-slate-300,
        .bg-slate-950 .text-slate-300 {
          color: #cbd5e1 !important;
        }
        .brand-bg-primary .brand-text-muted,
        .brand-bg-secondary .brand-text-muted,
        .bg-slate-950 .brand-text-muted {
          color: #cbd5e1 !important;
        }
      `}} />

      {/* Decorative Blob Elements */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20" 
        style={{ backgroundColor: themeColors.primary }}
      />
      <div 
        className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none opacity-15" 
        style={{ backgroundColor: themeColors.secondary }}
      />

      {/* Dynamic Header */}
      <header 
        className={`${website.stickyHeader ? "sticky top-0" : "relative"} z-50 py-5 border-b backdrop-blur-xl`}
        style={{
          backgroundColor: `${themeColors.background}cc`,
          borderColor: themeColors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 text-white shadow-md shadow-black/10"
              style={{ backgroundColor: themeColors.primary, borderRadius: brand.borderRadius }}
            >
              <Lucide.Landmark className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight heading-font" style={{ color: themeColors.text }}>
              {website.businessName}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
            {sections.filter((s: any) => 
              s.type !== "hero" && 
              s.type !== "cta" && 
              s.type !== "footer" &&
              s.type !== "features" &&
              s.type !== "statistics" &&
              s.type !== "testimonials"
            ).map((sec: any, idx: number) => (
              <a 
                key={idx} 
                href={`#${sec.type}`} 
                className="opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: themeColors.text }}
              >
                {sec.type.replace(/([A-Z])/g, " $1")}
              </a>
            ))}
          </nav>

          {website.contactPhone && (
            <a 
              href={`tel:${website.contactPhone}`} 
              className="text-xs font-bold px-5 py-2.5 border hover:bg-white/5 transition-all flex items-center gap-2"
              style={{
                borderRadius: brand.borderRadius,
                borderColor: themeColors.border,
                color: themeColors.text
              }}
            >
              <Lucide.Phone className="w-3.5 h-3.5" /> Call Now
            </a>
          )}
        </div>
      </header>

      {/* DYNAMIC SECTIONS PARSER */}
      <main>
        {sections.map((section: any, sectionIdx: number) => {
          const { type, layoutStyle, data } = section;

          return (
            <section 
              key={sectionIdx} 
              id={type} 
              className={`${getSpacingClass("padding")} relative border-b border-transparent`}
              style={{ borderBottomColor: `${themeColors.border}33` }}
            >
              <div className="max-w-7xl mx-auto px-6">
                
                {/* 1. HERO SECTION */}
                {type === "hero" && (
                  <div>
                    {layoutStyle === "split" && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <motion.div 
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={animVariants}
                          className="lg:col-span-7 space-y-8"
                        >
                          <div 
                            className="inline-flex items-center gap-2 px-4 py-1.5 border bg-white/5 backdrop-blur-md"
                            style={{ borderRadius: brand.borderRadius, borderColor: themeColors.border }}
                          >
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: themeColors.secondary }}></span>
                              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: themeColors.secondary }}></span>
                            </span>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest brand-text-muted">{website.businessCategory}</span>
                          </div>

                          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] heading-font text-gradient">
                            {data.title}
                          </h1>

                          <p className="brand-text-muted text-lg leading-relaxed max-w-xl">
                            {data.subtitle}
                          </p>

                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <a href="#contact" className="w-full sm:w-auto text-center px-8 py-4 text-sm font-bold shadow-lg brand-btn-primary">
                              {data.ctaText1}
                            </a>
                            <a 
                              href="#services" 
                              className="w-full sm:w-auto text-center px-8 py-4 text-sm font-bold border border-slate-700 hover:bg-white/5 transition-all text-white"
                              style={{ borderRadius: brand.borderRadius }}
                            >
                              {data.ctaText2}
                            </a>
                          </div>

                          {/* trust badge */}
                          {data.trustText && (
                            <div className="pt-6 border-t flex items-center gap-4 brand-border">
                              <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Lucide.Star key={i} className="w-3.5 h-3.5 fill-current" />
                                ))}
                              </div>
                              <span className="text-xs font-semibold text-slate-400">{data.trustText}</span>
                            </div>
                          )}
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, scale: 0.98 }}
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={animVariants}
                          className="lg:col-span-5 relative"
                        >
                          <div className="overflow-hidden shadow-2xl border" style={{ borderRadius: brand.borderRadius, borderColor: brand.colors.border }}>
                            <img src={imgs.hero} alt="Hero View" className="w-full object-cover aspect-[4/5]" />
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {layoutStyle === "centered" && (
                      <div className="text-center max-w-4xl mx-auto space-y-8 flex flex-col items-center">
                        <motion.div 
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={animVariants}
                          className="space-y-6 flex flex-col items-center"
                        >
                          <div 
                            className="inline-flex items-center gap-2 px-4 py-1.5 border bg-white/5 backdrop-blur-md"
                            style={{ borderRadius: brand.borderRadius, borderColor: brand.colors.border }}
                          >
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">{website.businessCategory}</span>
                          </div>

                          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] heading-font text-gradient">
                            {data.title}
                          </h1>

                          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                            {data.subtitle}
                          </p>

                          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2">
                            <a href="#contact" className="px-8 py-4 text-sm font-bold shadow-lg brand-btn-primary">
                              {data.ctaText1}
                            </a>
                            <a 
                              href="#services" 
                              className="px-8 py-4 text-sm font-bold border border-slate-700 hover:bg-white/5 transition-all text-white"
                              style={{ borderRadius: brand.borderRadius }}
                            >
                              {data.ctaText2}
                            </a>
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 40 }}
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={animVariants}
                          className="w-full relative pt-10"
                        >
                          <div className="overflow-hidden border shadow-2xl relative" style={{ borderRadius: brand.borderRadius, borderColor: brand.colors.border }}>
                            <img src={imgs.hero} alt="Showcase mock" className="w-full object-cover max-h-[460px]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* glassmorphic hero */}
                    {layoutStyle === "glass" && (
                      <div className="relative py-16 rounded-[32px] overflow-hidden border border-slate-800 bg-cover bg-center flex items-center justify-center min-h-[580px]" style={{ backgroundImage: `url(${imgs.hero})` }}>
                        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[4px]" />
                        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 space-y-6 flex flex-col items-center">
                          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight heading-font text-white">{data.title}</h1>
                          <p className="text-slate-300 text-base leading-relaxed max-w-xl">{data.subtitle}</p>
                          <div className="flex gap-4 pt-4">
                            <a href="#contact" className="px-8 py-4 text-sm font-bold brand-btn-primary">{data.ctaText1}</a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* bento grid hero layout */}
                    {layoutStyle === "bento" && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 p-8 border flex flex-col justify-center space-y-6 brand-card-bg brand-border" style={{ borderRadius: brand.borderRadius }}>
                          <h1 className="text-3xl sm:text-5xl font-black heading-font text-white leading-tight">{data.title}</h1>
                          <p className="text-slate-400 text-sm">{data.subtitle}</p>
                          <a href="#contact" className="w-fit px-6 py-3 font-bold brand-btn-primary text-xs">{data.ctaText1}</a>
                        </div>
                        <div className="overflow-hidden border brand-border aspect-[4/3] lg:aspect-auto" style={{ borderRadius: brand.borderRadius }}>
                          <img src={imgs.hero} alt="Bento grid visual" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. ABOUT SECTION */}
                {type === "about" && (
                  <div>
                    {layoutStyle === "sideImage" ? (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5 relative flex justify-center">
                          <div className="w-full aspect-square border p-4 brand-border brand-card-bg" style={{ borderRadius: brand.borderRadius }}>
                            <img src={imgs.about} alt="About image" className="w-full h-full object-cover rounded-xl" />
                          </div>
                        </div>
                        <div className="lg:col-span-7 space-y-6">
                          <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                          <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                          <p className="text-slate-400 leading-relaxed text-sm">{data.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                        <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                        <p className="text-slate-400 leading-relaxed text-sm">{data.content}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. WHY CHOOSE US */}
                {type === "whyChooseUs" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-5 space-y-6">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">Why Us</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                      <p className="text-slate-400 text-sm leading-relaxed">{data.subtitle}</p>
                    </div>
                    <div className="lg:col-span-7 space-y-6">
                      {data.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-5 border brand-border brand-card-bg" style={{ borderRadius: brand.borderRadius }}>
                          <div className="flex-shrink-0 p-2.5 rounded-lg brand-bg-primary text-white h-fit">
                            <DynamicIcon name={item.icon || "Check"} className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white heading-font">{item.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. SERVICES SECTION */}
                {type === "services" && (
                  <div>
                    <div className="text-center space-y-4 mb-16">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {data.items.map((ser: any, index: number) => (
                        <div 
                          key={index}
                          className="p-8 border brand-border brand-card-bg flex flex-col justify-between"
                          style={{ borderRadius: brand.borderRadius }}
                        >
                          <div>
                            <div className="p-3 w-fit rounded-xl brand-bg-primary text-white mb-6">
                              <DynamicIcon name={ser.icon || "Briefcase"} className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3 heading-font">{ser.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{ser.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. FEATURES SECTION */}
                {type === "features" && (
                  <div>
                    <div className="text-center space-y-4 mb-16">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {data.items.map((feat: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-6 border brand-border brand-card-bg" style={{ borderRadius: brand.borderRadius }}>
                          <div className="flex-shrink-0 p-2.5 rounded-lg brand-bg-primary text-white">
                            <DynamicIcon name={feat.icon || "Layers"} className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white heading-font">{feat.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{feat.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. STATISTICS SECTION */}
                {type === "statistics" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {data.items.map((stat: any, index: number) => (
                      <div 
                        key={index} 
                        className="p-8 border brand-border brand-card-bg text-center"
                        style={{ borderRadius: brand.borderRadius }}
                      >
                        <span className="text-4xl font-extrabold text-white text-gradient heading-font">{stat.value}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2 block">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 7. HOW IT WORKS */}
                {type === "howItWorks" && (
                  <div>
                    <div className="text-center space-y-4 mb-16">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {data.steps.map((step: any, idx: number) => (
                        <div key={idx} className="p-8 border brand-border brand-card-bg relative overflow-hidden" style={{ borderRadius: brand.borderRadius }}>
                          <span className="text-5xl font-black text-slate-800 absolute top-4 right-6 leading-none">
                            {step.step}
                          </span>
                          <div className="relative mt-4">
                            <h3 className="text-base font-bold text-white mb-2 heading-font">{step.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. PRICING SECTION */}
                {type === "pricing" && (
                  <div>
                    <div className="text-center space-y-4 mb-16">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>

                      <div className="flex items-center justify-center gap-3.5 pt-4">
                        <span className={`text-xs font-semibold ${billingPeriod === "month" ? "text-white" : "text-slate-500"}`}>Monthly billing</span>
                        <button 
                          onClick={() => setBillingPeriod(billingPeriod === "month" ? "year" : "month")}
                          className="w-12 h-6 rounded-full bg-slate-800 p-1 flex items-center relative transition-colors"
                        >
                          <motion.div 
                            layout
                            className="w-4 h-4 rounded-full brand-bg-secondary"
                            animate={{ x: billingPeriod === "month" ? 0 : 24 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                        <span className={`text-xs font-semibold ${billingPeriod === "year" ? "text-white" : "text-slate-500"} flex items-center gap-1.5`}>
                          Yearly billing <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Save 20%</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                      {data.plans.map((plan: any, idx: number) => {
                        const isPopular = !!plan.popular;
                        let displayPrice = plan.price;
                        if (billingPeriod === "year" && plan.price.startsWith("$")) {
                          const num = parseInt(plan.price.replace("$", ""), 10);
                          displayPrice = `$${Math.round(num * 0.8 * 12)}`;
                        }

                        return (
                          <div 
                            key={idx} 
                            className={`p-8 border flex flex-col justify-between relative transition-all ${
                              isPopular 
                                ? "border-[var(--secondary-color)] scale-[1.02] z-10" 
                                : "brand-border"
                            } brand-card-bg`}
                            style={{ borderRadius: brand.borderRadius }}
                          >
                            {isPopular && (
                              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white brand-bg-secondary">
                                Popular
                              </span>
                            )}

                            <div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.name}</span>
                              <div className="flex items-baseline gap-1 mt-4">
                                <span className="text-4xl font-extrabold text-white heading-font">{displayPrice}</span>
                                {plan.period && (
                                  <span className="text-xs text-slate-500 font-semibold">/{billingPeriod === "year" ? "year" : plan.period}</span>
                                )}
                              </div>

                              <ul className="space-y-3.5 mt-8 border-t border-slate-800/80 pt-6">
                                {plan.features.map((feat: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                                    <Lucide.Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <a 
                              href="#contact" 
                              className={`w-full text-center py-3.5 text-xs font-bold tracking-wider uppercase mt-8 block transition-all ${
                                isPopular 
                                  ? "brand-btn-secondary" 
                                  : "bg-slate-800 text-white hover:bg-slate-700"
                              }`}
                              style={{ borderRadius: brand.borderRadius }}
                            >
                              {plan.cta}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 9. FAQ SECTION */}
                {type === "faq" && (
                  <div>
                    <div className="text-center space-y-4 mb-16">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                      {data.items.map((item: any, index: number) => {
                        const isOpen = activeFaq === index;
                        return (
                          <div 
                            key={index}
                            className="border brand-border brand-card-bg overflow-hidden"
                            style={{ borderRadius: brand.borderRadius }}
                          >
                            <button 
                              onClick={() => setActiveFaq(isOpen ? null : index)}
                              className="w-full text-left p-6 flex justify-between items-center text-white hover:brand-text-secondary transition-colors"
                            >
                              <span className="text-sm font-bold heading-font pr-6">{item.question}</span>
                              <DynamicIcon 
                                name={isOpen ? "Minus" : "Plus"} 
                                className="w-4 h-4 text-slate-500 flex-shrink-0" 
                              />
                            </button>
                            
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <p className="text-xs text-slate-400 p-6 pt-0 border-t brand-border leading-relaxed">
                                    {item.answer}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 10. TESTIMONIALS SECTION */}
                {type === "testimonials" && (
                  <div>
                    <div className="text-center space-y-4 mb-16">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {data.items.map((test: any, index: number) => (
                        <div 
                          key={index}
                          className="p-8 border brand-border brand-card-bg relative flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl"
                          style={{ borderRadius: brand.borderRadius }}
                        >
                          <Lucide.MessageSquare className="w-8 h-8 text-[var(--secondary-color)]/20 absolute top-6 right-8" />
                          <p className="text-sm text-slate-300 italic leading-relaxed mb-6 font-['Poppins']">
                            "{test.quote}"
                          </p>
                          <div className="border-t brand-border pt-5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase brand-bg-primary">
                              {test.author ? test.author[0] : "C"}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white heading-font">{test.author}</h4>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{test.company}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 11. GALLERY SECTION */}
                {type === "gallery" && (
                  <div>
                    <div className="text-center space-y-4 mb-16">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {imgs.gallery.map((img, i) => (
                        <div key={i} className="overflow-hidden border brand-border aspect-[4/3] relative group shadow-lg" style={{ borderRadius: brand.borderRadius }}>
                          <img 
                            src={img} 
                            alt="Gallery Show" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 12. CTA SECTION */}
                {type === "cta" && (
                  <div className="max-w-5xl mx-auto">
                    <div className="relative border p-12 lg:p-16 overflow-hidden brand-bg-primary shadow-2xl flex flex-col items-center text-center brand-border" style={{ borderRadius: brand.borderRadius }}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_40%)]" />
                      <div className="relative z-10 space-y-6 max-w-2xl flex flex-col items-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight heading-font">
                          {data.title}
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {data.subtitle}
                        </p>
                        <a 
                          href="#contact" 
                          className="brand-bg-secondary text-white font-bold px-8 py-4 shadow-lg text-sm hover:scale-[1.02] transition-transform"
                          style={{ borderRadius: brand.borderRadius }}
                        >
                          {data.buttonText}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 13. CONTACT SECTION */}
                {type === "contact" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-5xl mx-auto">
                    <div className="lg:col-span-5 space-y-8">
                      <span className="text-xs font-bold tracking-widest uppercase brand-text-secondary">{data.subtitle}</span>
                      <h2 className="text-3xl font-bold tracking-tight text-white heading-font">{data.title}</h2>
                      
                      <div className="space-y-4 text-xs font-semibold text-slate-400">
                        {website.contactEmail && (
                          <div className="flex items-center gap-4 border brand-border brand-card-bg p-5" style={{ borderRadius: brand.borderRadius }}>
                            <Lucide.Mail className="w-5 h-5 brand-text-secondary" />
                            <span>{website.contactEmail}</span>
                          </div>
                        )}
                        {website.contactPhone && (
                          <div className="flex items-center gap-4 border brand-border brand-card-bg p-5" style={{ borderRadius: brand.borderRadius }}>
                            <Lucide.Phone className="w-5 h-5 brand-text-secondary" />
                            <span>{website.contactPhone}</span>
                          </div>
                        )}
                        {website.address && (
                          <div className="flex flex-col gap-2 border brand-border brand-card-bg p-5" style={{ borderRadius: brand.borderRadius }}>
                            <div className="flex items-center gap-4">
                              <Lucide.MapPin className="w-5 h-5 brand-text-secondary" />
                              <span className="leading-relaxed">{website.address}, {website.city}, {website.state}</span>
                            </div>
                            {website.googleMapsLink && (
                              <a 
                                href={website.googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold brand-text-secondary hover:underline flex items-center gap-1.5 mt-1 pl-9"
                              >
                                <Lucide.ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      {website.contactFormRequired ? (
                        <ContactForm />
                      ) : (
                        <div className="p-8 border brand-border brand-card-bg flex items-center justify-center min-h-[300px]" style={{ borderRadius: brand.borderRadius }}>
                          <span className="font-bold brand-text-muted">Direct support is available via email and phone.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </section>
          );
        })}
      </main>

      {/* Dynamic Footer */}
      <footer 
        className="py-12 text-slate-500 text-xs border-t text-center relative z-10"
        style={{
          backgroundColor: brand.colors.background === "#FFFFFF" ? "#F8FAFC" : "#020617",
          borderColor: brand.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div 
              className="p-2 text-white shadow-md"
              style={{ backgroundColor: brand.colors.primary, borderRadius: brand.borderRadius }}
            >
              <Lucide.Landmark className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white heading-font">
              {website.businessName}
            </span>
          </div>

          {website.socialLinks && Object.values(website.socialLinks).some(val => val) && (
            <div className="flex items-center justify-center gap-5 pt-1 pb-3">
              {website.socialLinks.facebook && (
                <a href={website.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 hover:scale-105 transition-all" style={{ color: themeColors.text }}>
                  {React.createElement((Lucide as any).Facebook || (Lucide as any).Sparkles, { className: "w-4 h-4" })}
                </a>
              )}
              {website.socialLinks.instagram && (
                <a href={website.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 hover:scale-105 transition-all" style={{ color: themeColors.text }}>
                  {React.createElement((Lucide as any).Instagram || (Lucide as any).Sparkles, { className: "w-4 h-4" })}
                </a>
              )}
              {website.socialLinks.linkedin && (
                <a href={website.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 hover:scale-105 transition-all" style={{ color: themeColors.text }}>
                  {React.createElement((Lucide as any).Linkedin || (Lucide as any).Sparkles, { className: "w-4 h-4" })}
                </a>
              )}
              {website.socialLinks.twitter && (
                <a href={website.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 hover:scale-105 transition-all" style={{ color: themeColors.text }}>
                  {React.createElement((Lucide as any).Twitter || (Lucide as any).Sparkles, { className: "w-4 h-4" })}
                </a>
              )}
              {website.socialLinks.youtube && (
                <a href={website.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 hover:scale-105 transition-all" style={{ color: themeColors.text }}>
                  {React.createElement((Lucide as any).Youtube || (Lucide as any).Sparkles, { className: "w-4 h-4" })}
                </a>
              )}
            </div>
          )}

          <p>© {new Date().getFullYear()} {website.businessName}. All rights reserved.</p>
          <span className="text-[10px] text-slate-700 font-bold block mt-1">Powered by SDPT AI Website Builder</span>
        </div>
      </footer>

      {/* Floating WhatsApp chat widget */}
      {website.whatsappButtonRequired && website.whatsappNumber && (
        <a 
          href={`https://wa.me/${website.whatsappNumber}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fixed bottom-6 right-6 p-4.5 rounded-full bg-emerald-500 text-white shadow-2xl hover:scale-105 transition-all z-50 flex items-center justify-center"
          title="Chat on WhatsApp"
        >
          <Lucide.MessageSquare className="w-6 h-6" />
        </a>
      )}
    </div>
  );
}
