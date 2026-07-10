import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Website from "@/models/Website";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const userId = (session.user as any).id || (session.user as any)._id;
    const body = await req.json();
    
    const { 
      businessName,
      businessCategory,
      businessDescription,
      contactEmail,
      contactPhone,
      whatsappNumber,
      address,
      city,
      state,
      country,
      googleMapsLink,
      socialLinks,
      websiteType,
      websiteGoal,
      websiteTone,
      themeColors,
      fontStyle,
      pages,
      homeSections,
      heroHeading,
      heroSubheading,
      ctaText,
      contactFormRequired,
      whatsappButtonRequired,
      stickyHeader,
      darkMode,
      animations,
      subdomain
    } = body;

    if (!businessName || !businessCategory || !businessDescription || !subdomain) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/\s+/g, "").trim();

    await dbConnect();
    const existing = await Website.findOne({ subdomain: cleanSubdomain });
    if (existing) {
      return NextResponse.json({ message: "Subdomain is already taken." }, { status: 400 });
    }

    let generatedContent = null;
    const token = process.env.GITHUB_AI_TOKEN;

    if (token) {
      try {
        const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are a world-class digital agency team comprising an Art Director, Brand Designer, UI/UX Designer, Motion Designer, and Copywriter. You output strictly valid, clean JSON content. Do not output any markdown formatting, do not wrap in ```json blocks, do not output explanatory text. Only output raw valid JSON."
              },
              {
                role: "user",
                content: `Design and generate a completely custom, premium brand identity, copywriting, and layout structure for the business: "${businessName}".
Category: ${businessCategory}. 
Description: ${businessDescription}. 
Goal: ${websiteGoal}. 
Tone: ${websiteTone}. 
Location: ${city}, ${state}, ${country}.
Preferred Theme Mode: ${darkMode ? 'Dark Mode (Dark Background)' : 'Light Mode (White/Light Background)'}.
Font Style Choice: ${fontStyle} (Corporate font pairs for Corporate, Minimalist/Clean font pairs for Minimal, High-end serif/sans pairs for Elegant, Modern sans-serifs for Modern).
Preferred Primary Accent Color: ${themeColors?.primary || 'Auto'}.

CRITICAL DESIGN RULES:
1. Every layout must be created dynamically. Never use identical section sequences or stock layouts.
2. Select a premium font pair from (Inter, Sora, Manrope, Space Grotesk, Playfair Display, Cormorant, Poppins, Urbanist, Outfit) matching the Font Style Choice.
3. Design a unique color scheme (primary, secondary, accent, background, surface, cardBackground, border, text).
   - IF Preferred Theme Mode is Dark Mode, background MUST be dark (e.g., #020617, #0B0F19, #05050A) and text MUST be light (e.g. #F8FAFC, #FFFFFF).
   - IF Preferred Theme Mode is Light Mode, background MUST be light/white (e.g. #FFFFFF, #F8FAFC, #F3F4F6) and text MUST be dark (e.g. #0F172A, #1E293B).
   - Incorporate the Preferred Primary Accent Color as the primary accent color of the site.
4. Intelligently structure sections based on the business type. Include hero, about, services, features, statistics, pricing, testimonials, faq, howItWorks, cta, contact. Randomize section order intelligently (Hero always first, Contact/Footer last).
5. For each section, select a unique layoutStyle (e.g., hero: split/centered/bento/glass, services: grid/cards/rows, about: standard/sideImage/split).
6. Generate 100% human-quality copywriting. No Lorem Ipsum, no Latin, no generic templates.

Output a JSON object with this exact structure:
{
  "brand": {
    "colors": {
      "primary": "#hex",
      "secondary": "#hex",
      "accent": "#hex",
      "background": "#hex",
      "surface": "#hex",
      "cardBackground": "#hex",
      "border": "#hex",
      "text": "#hex"
    },
    "typography": {
      "headingFont": "fontName",
      "bodyFont": "fontName"
    },
    "borderRadius": "0px | 8px | 16px | 24px",
    "shadowStyle": "none | shadow-sm | shadow-md | shadow-lg | shadow-xl",
    "spacingScale": "compact | comfortable | loose",
    "heroLayout": "split | centered | bento | glass",
    "animationPreset": "fade | slide | scale | float"
  },
  "sections": [
    {
      "type": "hero",
      "layoutStyle": "split | centered | bento | glass",
      "data": {
        "title": "A compelling Awwwards-style headline",
        "subtitle": "A persuasive supporting paragraph detailing the value proposition",
        "ctaText1": "${ctaText || 'Get Started'}",
        "ctaText2": "Learn More",
        "trustText": "Trusted by over 2,000+ customers"
      }
    },
    {
      "type": "about",
      "layoutStyle": "standard | sideImage | split",
      "data": {
        "title": "About ${businessName}",
        "subtitle": "Our Vision",
        "content": "A detailed 3-sentence company overview matching the brand tone."
      }
    },
    {
      "type": "whyChooseUs",
      "layoutStyle": "grid | list | cards",
      "data": {
        "title": "Why Choose Us",
        "subtitle": "Uncompromising commitment to quality and results",
        "items": [
          { "title": "...", "description": "...", "icon": "LucideIconName" }
        ]
      }
    },
    {
      "type": "services",
      "layoutStyle": "grid | cards | rows",
      "data": {
        "title": "Our Services",
        "subtitle": "Tailored solutions for your business",
        "items": [
          { "title": "...", "description": "...", "icon": "LucideIconName" }
        ]
      }
    },
    {
      "type": "features",
      "layoutStyle": "grid | cards",
      "data": {
        "title": "Core Features",
        "subtitle": "Advanced operational capabilities",
        "items": [
          { "title": "...", "description": "...", "icon": "LucideIconName" }
        ]
      }
    },
    {
      "type": "statistics",
      "layoutStyle": "grid | cards | overlay",
      "data": {
        "items": [
          { "value": "99%", "label": "..." }
        ]
      }
    },
    {
      "type": "howItWorks",
      "layoutStyle": "timeline | cards | steps",
      "data": {
        "title": "How It Works",
        "subtitle": "Our roadmap",
        "steps": [
          { "step": "01", "title": "...", "description": "..." }
        ]
      }
    },
    {
      "type": "pricing",
      "layoutStyle": "cards | grid",
      "data": {
        "title": "Pricing Plans",
        "subtitle": "Select a plan that fits your business scale",
        "plans": [
          { "name": "Starter", "price": "$199", "period": "month", "features": ["Feature A", "Feature B"], "cta": "Get Started" },
          { "name": "Professional", "price": "$399", "period": "month", "features": ["Feature A", "Feature B", "Feature C"], "cta": "Go Pro", "popular": true },
          { "name": "Enterprise", "price": "Custom", "period": "", "features": ["Custom settings", "Dedicated support"], "cta": "Contact Us" }
        ]
      }
    },
    {
      "type": "faq",
      "layoutStyle": "accordion | grid",
      "data": {
        "title": "Common Questions",
        "subtitle": "FAQ",
        "items": [
          { "question": "...", "answer": "..." }
        ]
      }
    },
    {
      "type": "testimonials",
      "layoutStyle": "grid | cards | columns",
      "data": {
        "title": "Testimonials",
        "subtitle": "What they say",
        "items": [
          { "quote": "...", "author": "...", "company": "..." }
        ]
      }
    },
    {
      "type": "gallery",
      "layoutStyle": "grid | rows | mosaic",
      "data": {
        "title": "Visual Gallery",
        "subtitle": "Explore our environment"
      }
    },
    {
      "type": "cta",
      "layoutStyle": "centered | split | glass",
      "data": {
        "title": "Transform Your Operations Today",
        "subtitle": "Contact us to schedule your onboarding session.",
        "buttonText": "Get Started"
      }
    },
    {
      "type": "contact",
      "layoutStyle": "split | grid",
      "data": {
        "title": "Contact Us",
        "subtitle": "We look forward to hearing from you"
      }
    }
  ]
}`
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        });

        if (response.ok) {
          const data = await response.json();
          let rawText = data.choices[0].message.content.trim();
          
          if (rawText.startsWith("```json")) {
            rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
          } else if (rawText.startsWith("```")) {
            rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
          }

          generatedContent = JSON.parse(rawText);
        } else {
          console.warn("GitHub AI API returned error:", await response.text());
        }
      } catch (aiErr) {
        console.error("AI Generation request failed, using local builder:", aiErr);
      }
    }

    if (!generatedContent) {
      // Local builder random presets for true dynamic fallback
      const fontsHeading = ["Inter", "Sora", "Manrope", "Space Grotesk", "Playfair Display", "Poppins", "Outfit"];
      const fontsBody = ["Inter", "Manrope", "DM Sans", "Plus Jakarta Sans", "Poppins"];
      const radii = ["0px", "8px", "16px", "24px"];
      const shadows = ["none", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"];
      const spaces = ["compact", "comfortable", "loose"];
      const heroLayouts = ["split", "centered", "bento", "glass"];
      const anims = ["fade", "slide", "scale", "float"];

      // Category color presets
      const themeColorsPool: Record<string, any> = {
        "Finance / Accounting": { primary: "#0F172A", secondary: "#10B981", accent: "#3B82F6", background: "#020617", surface: "#0B1528", cardBackground: "#0E1E38", border: "#1E293B", text: "#F8FAFC" },
        "Law Firm": { primary: "#0A192F", secondary: "#C5A880", accent: "#C5A880", background: "#020C1B", surface: "#0B192E", cardBackground: "#112240", border: "#1F2937", text: "#F3F4F6" },
        "Restaurant / Cafe": { primary: "#7C2D12", secondary: "#F97316", accent: "#FCD34D", background: "#FFFBEB", surface: "#FDFDFD", cardBackground: "#FFFFFF", border: "#F3F4F6", text: "#1F2937" },
        "Clinic / Healthcare": { primary: "#0891B2", secondary: "#06B6D4", accent: "#0EA5E9", background: "#FFFFFF", surface: "#F8FAFC", cardBackground: "#FFFFFF", border: "#E2E8F0", text: "#0F172A" },
        "Education / School": { primary: "#1E3A8A", secondary: "#10B981", accent: "#F59E0B", background: "#FFFFFF", surface: "#F8FAFC", cardBackground: "#FFFFFF", border: "#E5E7EB", text: "#1F2937" },
        "Real Estate": { primary: "#1E293B", secondary: "#00B4D8", accent: "#00B4D8", background: "#FFFFFF", surface: "#F8FAFC", cardBackground: "#FFFFFF", border: "#F3F4F6", text: "#0F172A" }
      };

      const selectColorTheme = () => {
        let basePreset = themeColorsPool[businessCategory] || { primary: "#312E81", secondary: "#818CF8", accent: "#C7D2FE", background: "#03001C", surface: "#150050", cardBackground: "#3F0071", border: "#3F0071", text: "#EEEEEE" };
        
        // Adjust background and text properties depending on darkMode parameter
        if (!darkMode) {
          return {
            primary: themeColors?.primary || basePreset.primary,
            secondary: themeColors?.secondary || basePreset.secondary,
            accent: themeColors?.accent || basePreset.accent,
            background: "#FFFFFF",
            surface: "#F8FAFC",
            cardBackground: "#FFFFFF",
            border: "#E2E8F0",
            text: "#0F172A"
          };
        } else {
          return {
            primary: themeColors?.primary || basePreset.primary,
            secondary: themeColors?.secondary || basePreset.secondary,
            accent: themeColors?.accent || basePreset.accent,
            background: basePreset.background === "#FFFFFF" || basePreset.background === "#FFFBEB" ? "#0B0F19" : basePreset.background,
            surface: basePreset.surface === "#F8FAFC" ? "#111827" : basePreset.surface,
            cardBackground: basePreset.cardBackground === "#FFFFFF" ? "#1F2937" : basePreset.cardBackground,
            border: basePreset.border === "#E2E8F0" ? "#374151" : basePreset.border,
            text: basePreset.text === "#0F172A" ? "#F9FAFB" : basePreset.text
          };
        }
      };

      const jitterColor = (hex: string, amount: number = 20) => {
        if (!hex || !hex.startsWith("#")) return hex;
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        const jitterVal = () => Math.floor(Math.random() * (amount * 2 + 1)) - amount;
        r = Math.min(255, Math.max(0, r + jitterVal()));
        g = Math.min(255, Math.max(0, g + jitterVal()));
        b = Math.min(255, Math.max(0, b + jitterVal()));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };

      const baseThemeColors = selectColorTheme();
      const selectedThemeColors = {
        ...baseThemeColors,
        primary: jitterColor(baseThemeColors.primary),
        secondary: jitterColor(baseThemeColors.secondary),
        accent: jitterColor(baseThemeColors.accent)
      };

      // Programmatically shuffle section order for visual uniqueness
      const defaultSections = [
        "about",
        "whyChooseUs",
        "services",
        "features",
        "statistics",
        "howItWorks",
        "pricing",
        "faq",
        "testimonials",
        "gallery"
      ];
      
      const shuffleArray = (arr: any[]) => {
        return arr.sort(() => Math.random() - 0.5);
      };
      
      const selectedSectionsOrder = shuffleArray([...defaultSections]).slice(0, 7); // Select random 7 sections

      generatedContent = {
        brand: {
          colors: selectedThemeColors,
          typography: {
            headingFont: fontsHeading[Math.floor(Math.random() * fontsHeading.length)],
            bodyFont: fontsBody[Math.floor(Math.random() * fontsBody.length)]
          },
          borderRadius: radii[Math.floor(Math.random() * radii.length)],
          shadowStyle: shadows[Math.floor(Math.random() * shadows.length)],
          spacingScale: spaces[Math.floor(Math.random() * spaces.length)],
          heroLayout: heroLayouts[Math.floor(Math.random() * heroLayouts.length)],
          animationPreset: anims[Math.floor(Math.random() * anims.length)]
        },
        sections: [
          {
            type: "hero",
            layoutStyle: heroLayouts[Math.floor(Math.random() * heroLayouts.length)],
            data: {
              title: heroHeading || `Professional ${businessCategory} Solutions`,
              subtitle: heroSubheading || `Tailored ${websiteGoal.toLowerCase()} procedures modeled around compliance and excellence.`,
              ctaText1: ctaText || "Get In Touch",
              ctaText2: "Learn More",
              trustText: "Approved by 2,000+ local partners"
            }
          },
          ...selectedSectionsOrder.map(section => {
            if (section === "about") {
              return {
                type: "about",
                layoutStyle: ["standard", "sideImage", "split"][Math.floor(Math.random() * 3)],
                data: {
                  title: `About ${businessName}`,
                  subtitle: "Our Story",
                  content: `${businessName} is a leading provider of ${businessCategory} services. Driven by a commitment to excellence and professional care, we help our clients in ${city || 'your region'} achieve sustainable success.`
                }
              };
            }
            if (section === "whyChooseUs") {
              return {
                type: "whyChooseUs",
                layoutStyle: ["grid", "list", "cards"][Math.floor(Math.random() * 3)],
                data: {
                  title: "Why Partner With Us",
                  subtitle: "Ensuring top-tier efficiency and client satisfaction",
                  items: [
                    { title: "Strategic Planning", description: "Direct roadmaps and target analysis customized for your requirements.", icon: "Award" },
                    { title: "Compliance Verification", description: "All operations audit-ready and verified by certified teams.", icon: "Shield" },
                    { title: "Priority Onboarding", description: "Get started within 24 hours with dedicated support access.", icon: "Clock" }
                  ]
                }
              };
            }
            if (section === "services") {
              return {
                type: "services",
                layoutStyle: ["grid", "cards", "rows"][Math.floor(Math.random() * 3)],
                data: {
                  title: "Practice Areas",
                  subtitle: "Our Core Services",
                  items: [
                    { title: "Custom Solutions", description: "Tailored strategizing sessions to evaluate targets and operational guidelines.", icon: "Briefcase" },
                    { title: "Enterprise Systems", description: "Sync existing databases with secure API endpoints and custom dashboards.", icon: "TrendingUp" },
                    { title: "Priority Support", description: "Direct client relations assistance for onboarding and configuration management.", icon: "Zap" }
                  ]
                }
              };
            }
            if (section === "features") {
              return {
                type: "features",
                layoutStyle: ["grid", "cards"][Math.floor(Math.random() * 2)],
                data: {
                  title: "Featured Highlights",
                  subtitle: "Delivering Next-Gen Capabilities",
                  items: [
                    { title: "Verified Competency", description: "Direct audited procedures ensuring clean performance.", icon: "Layers" },
                    { title: "Client First Approach", description: "Custom tailored timelines matching your operational scale.", icon: "Shield" }
                  ]
                }
              };
            }
            if (section === "statistics") {
              return {
                type: "statistics",
                layoutStyle: ["grid", "cards"][Math.floor(Math.random() * 2)],
                data: {
                  items: [
                    { value: "98%", label: "Client Retention Rate" },
                    { value: "10K+", label: "Projects Completed" },
                    { value: "24/7", label: "On-Call Support" }
                  ]
                }
              };
            }
            if (section === "howItWorks") {
              return {
                type: "howItWorks",
                layoutStyle: ["timeline", "steps"][Math.floor(Math.random() * 2)],
                data: {
                  title: "Our Operational Process",
                  subtitle: "Simplified roadmap to get your systems online",
                  steps: [
                    { step: "01", title: "Discovery", description: "Comprehensive analysis of business goals and requirements." },
                    { step: "02", title: "Plan Execution", description: "Mapping strategy, timelines, and milestones." },
                    { step: "03", title: "Active Launch", description: "Rollout and verification under professional oversight." }
                  ]
                }
              };
            }
            if (section === "pricing") {
              return {
                type: "pricing",
                layoutStyle: ["cards", "grid"][Math.floor(Math.random() * 2)],
                data: {
                  title: "Pricing Structure",
                  subtitle: "Select a plan scaled for your requirements",
                  plans: [
                    { name: "Starter", price: "$199", period: "month", features: ["Core features access", "Email support", "Basic dashboard statistics"], cta: "Get Started" },
                    { name: "Professional", price: "$399", period: "month", features: ["All Starter features", "Priority phone support", "Custom compliance reports"], cta: "Go Pro", popular: true },
                    { name: "Enterprise", price: "Custom", period: "", features: ["Full customized settings", "Dedicated manager", "24/7 SLA uptime verification"], cta: "Contact Us" }
                  ]
                }
              };
            }
            if (section === "faq") {
              return {
                type: "faq",
                layoutStyle: ["accordion", "grid"][Math.floor(Math.random() * 2)],
                data: {
                  title: "Common FAQ",
                  subtitle: "Find answers quickly",
                  items: [
                    { question: "What are your core terms?", answer: "We define scopes based on business dimensions, operational targets, and product complexity." },
                    { question: "How do we get started?", answer: "Reach out via our direct messaging forms or call numbers to set up an onboarding checklist." }
                  ]
                }
              };
            }
            if (section === "testimonials") {
              return {
                type: "testimonials",
                layoutStyle: ["grid", "columns"][Math.floor(Math.random() * 2)],
                data: {
                  title: "Customer Reviews",
                  subtitle: "Partner Success Stories",
                  items: [
                    { quote: "Their services streamlined our workflows completely. Custom checklists and support are second to none.", author: "Arjun Mehta", company: "Metro Group" },
                    { quote: "Highly responsive professional team. Our compliance audits have never been smoother.", author: "Kriti Sharma", company: "Nexa Capital" }
                  ]
                }
              };
            }
            // Gallery
            return {
              type: "gallery",
              layoutStyle: "grid",
              data: {
                title: "Visual Showcase",
                subtitle: "Our Premium Working Environment"
              }
            };
          }),
          {
            type: "cta",
            layoutStyle: ["centered", "split", "glass"][Math.floor(Math.random() * 3)],
            data: {
              title: "Ready to scale your business operations?",
              subtitle: "Get in touch today to schedule an onboarding consultation.",
              buttonText: "Schedule Call"
            }
          },
          {
            type: "contact",
            layoutStyle: "split",
            data: {
              title: "Establish Connection",
              subtitle: "Contact us today for direct consulting."
            }
          }
        ]
      };
    }

    const newWebsite = await Website.create({
      userId,
      subdomain: cleanSubdomain,
      businessName,
      businessCategory,
      businessDescription,
      contactEmail,
      contactPhone,
      whatsappNumber,
      address,
      city,
      state,
      country,
      googleMapsLink,
      socialLinks,
      websiteType,
      websiteGoal,
      websiteTone,
      themeColors,
      fontStyle,
      pages,
      homeSections,
      heroHeading: heroHeading || generatedContent.sections.find((s: any) => s.type === "hero")?.data.title,
      heroSubheading: heroSubheading || generatedContent.sections.find((s: any) => s.type === "hero")?.data.subtitle,
      ctaText: ctaText || generatedContent.sections.find((s: any) => s.type === "hero")?.data.ctaText1 || "Get In Touch",
      contactFormRequired,
      whatsappButtonRequired,
      stickyHeader,
      darkMode,
      animations,
      generatedContent,
      isPublished: true
    });

    return NextResponse.json({
      success: true,
      message: "Website generated successfully!",
      website: newWebsite
    }, { status: 201 });

  } catch (error: any) {
    console.error("Website generation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

