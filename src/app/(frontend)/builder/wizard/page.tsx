"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/business/Button";
import Card from "@/components/business/Card";
import { 
  Building, ChevronRight, ChevronLeft, Loader2, CheckCircle2, 
  Sparkles, Globe, Layout, Palette, Settings2 
} from "lucide-react";
import toast from "react-hot-toast";

function WizardContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgradeParam = searchParams.get("upgrade");

  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    businessCategory: "Consulting",
    businessDescription: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    googleMapsLink: "",
    logoUrl: "",
    coverUrl: "",
    businessHours: "9:00 AM - 6:00 PM",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
    },
    websiteType: "Business Website",
    websiteGoal: "Generate Leads",
    websiteTone: "Professional",
    themeColors: {
      primary: "#102E63",
      secondary: "#00B4D8",
      accent: "#00B4D8",
    },
    fontStyle: "Modern",
    pages: ["Home", "About", "Services", "FAQ", "Contact"],
    homeSections: ["Hero", "About", "Services", "FAQ", "Testimonials", "Contact", "Footer"],
    heroHeading: "",
    heroSubheading: "",
    ctaText: "",
    contactFormRequired: true,
    whatsappButtonRequired: true,
    stickyHeader: true,
    darkMode: false,
    animations: "Premium",
    subdomain: "",
  });

  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true&callback=/builder/wizard");
    }
  }, [status, router]);

  // Subdomain Validation
  const checkSubdomain = async (val: string) => {
    if (!val) {
      setSubdomainAvailable(null);
      return;
    }
    setCheckingSubdomain(true);
    try {
      const res = await fetch(`/api/builder/check-subdomain?subdomain=${val}`);
      const data = await res.json();
      setSubdomainAvailable(data.available);
    } catch (e) {
      console.error(e);
      setSubdomainAvailable(false);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.subdomain) {
        checkSubdomain(formData.subdomain);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.subdomain]);

  const handleNext = () => {
    if (step === 1 && (!formData.businessName || !formData.businessDescription)) {
      toast.error("Please fill out the business name and description.");
      return;
    }
    if (step === 4 && (!formData.subdomain || subdomainAvailable === false)) {
      toast.error("Please enter a unique, available subdomain.");
      return;
    }
    setStep((p) => p + 1);
  };

  const handleBack = () => {
    setStep((p) => p - 1);
  };

  const stepsList = [
    { title: "Business Info", desc: "Category, Name, Contact details", icon: Building },
    { title: "Style & Goal", desc: "Themes, Colors, Layout Goal", icon: Palette },
    { title: "Pages & Blocks", desc: "Structural sections overrides", icon: Layout },
    { title: "Subdomain Choice", desc: "Define your publish URL", icon: Globe },
    { title: "Review & Build", desc: "Compile configurations", icon: Settings2 },
  ];

  const generationStages = [
    "Analyzing business specifications...",
    "Creating layout responsive structure...",
    "Writing custom copy blocks...",
    "Injecting color schemas and style values...",
    "Deploying subdomain nodes and files...",
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);

    // Simulate progress updates for stages
    const intervals = stagesProgress();

    try {
      const res = await fetch("/api/builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Stop progress simulator and jump to end stage
        intervals.forEach(clearInterval);
        setGenerationStep(4);
        setTimeout(() => {
          toast.success("Website created successfully!");
          router.push(`/dashboard`);
        }, 1500);
      } else {
        intervals.forEach(clearInterval);
        setGenerating(false);
        toast.error(data.message || "Failed to generate website.");
      }
    } catch (err) {
      intervals.forEach(clearInterval);
      setGenerating(false);
      toast.error("Network or api error. Please try again.");
    }
  };

  function stagesProgress() {
    const list: NodeJS.Timeout[] = [];
    generationStages.forEach((_, idx) => {
      const t = setTimeout(() => {
        setGenerationStep(idx);
      }, idx * 2500);
      list.push(t as unknown as NodeJS.Timeout);
    });
    return list;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Poppins']">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#102E63] animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Verifying session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center font-['Poppins'] text-slate-800">
      <div className="max-w-4xl w-full mx-auto px-6">
        
        {upgradeParam && (
          <div className="mb-8 border border-emerald-200/60 bg-emerald-50/70 backdrop-blur-md px-6 py-4.5 rounded-2xl flex items-start gap-3.5 max-w-2xl mx-auto">
            <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/10">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 block">Premium {upgradeParam.toUpperCase()} Plan Activated!</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Welcome to the premium tier. Enjoy white-label subdomain publishing and custom AI styles.</span>
            </div>
          </div>
        )}

        {/* Progress Timeline Header */}
        {!generating && (
          <div className="grid grid-cols-5 gap-3 mb-10 max-w-2xl mx-auto text-center">
            {stepsList.map((st, idx) => {
              const Icon = st.icon;
              const active = step === idx + 1;
              const passed = step > idx + 1;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 border-2 ${
                    active ? "bg-[#102E63] border-[#102E63] text-white" :
                    passed ? "bg-green-500 border-green-500 text-white" :
                    "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {passed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 hidden sm:block ${active ? "text-[#102E63]" : "text-slate-400"}`}>
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 border border-slate-100 shadow-xl max-w-xl mx-auto text-center space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto">
                <Loader2 className="w-20 h-20 text-blue-600 animate-spin absolute inset-0" />
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center absolute top-3 left-3">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 font-['Albert_Sans']">Compiling AI Website</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Our system is querying the GitHub AI model to structure copy blocks and themes.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-left max-w-sm mx-auto space-y-2.5">
                {generationStages.map((stage, idx) => {
                  const active = generationStep === idx;
                  const passed = generationStep > idx;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0" />
                      )}
                      <span className={`${active ? "text-blue-600 font-semibold" : passed ? "text-slate-800" : "text-slate-400"}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-2xl mx-auto"
            >
              
              {/* STEP 1: Business Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Albert_Sans']">Tell us about your business</h2>
                    <p className="text-xs text-[#666]">Enter the operating parameters of your local brand.</p>
                  </div>

                  <div className="space-y-4 font-['Poppins'] text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">BUSINESS NAME *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Apex Legal Services"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">BUSINESS CATEGORY *</label>
                        <select 
                          value={formData.businessCategory}
                          onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        >
                          <option>Consulting</option>
                          <option>Clinic / Healthcare</option>
                          <option>Agency / Studio</option>
                          <option>Restaurant / Cafe</option>
                          <option>Education / School</option>
                          <option>Finance / Accounting</option>
                          <option>Law Firm</option>
                          <option>Real Estate</option>
                          <option>Retail / Service Shop</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-500 block mb-1.5">BUSINESS DESCRIPTION *</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Provide 2-3 sentences explaining what products or services you offer."
                        value={formData.businessDescription}
                        onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">BUSINESS EMAIL</label>
                        <input 
                          type="email" 
                          placeholder="contact@apex.in"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">CONTACT PHONE</label>
                        <input 
                          type="tel" 
                          placeholder="98765 43210"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">WHATSAPP NUMBER</label>
                        <input 
                          type="tel" 
                          placeholder="98765 43210"
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="font-bold text-slate-500 block mb-1.5">ADDRESS</label>
                        <input 
                          type="text" 
                          placeholder="Street details..."
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">CITY</label>
                        <input 
                          type="text" 
                          placeholder="City name"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">STATE</label>
                        <input 
                          type="text" 
                          placeholder="State name"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Website Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Albert_Sans']">Style & Goals</h2>
                    <p className="text-xs text-[#666]">Select the design parameters of your generated layout.</p>
                  </div>

                  <div className="space-y-4 font-['Poppins'] text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">WEBSITE TYPE</label>
                        <select 
                          value={formData.websiteType}
                          onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        >
                          <option>Business Website</option>
                          <option>Portfolio</option>
                          <option>Agency</option>
                          <option>Corporate Website</option>
                          <option>Consulting</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">WEBSITE GOAL</label>
                        <select 
                          value={formData.websiteGoal}
                          onChange={(e) => setFormData({ ...formData, websiteGoal: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        >
                          <option>Generate Leads</option>
                          <option>Bookings</option>
                          <option>Sales</option>
                          <option>Showcase / Portfolio</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">WEBSITE TONE</label>
                        <select 
                          value={formData.websiteTone}
                          onChange={(e) => setFormData({ ...formData, websiteTone: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        >
                          <option>Professional</option>
                          <option>Modern</option>
                          <option>Minimal</option>
                          <option>Luxury</option>
                          <option>Friendly</option>
                          <option>Premium</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">FONT STYLE</label>
                        <select 
                          value={formData.fontStyle}
                          onChange={(e) => setFormData({ ...formData, fontStyle: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        >
                          <option>Modern</option>
                          <option>Elegant</option>
                          <option>Corporate</option>
                          <option>Minimal</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">PRIMARY ACCENT COLOR</label>
                        <input 
                          type="color" 
                          value={formData.themeColors.primary}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            themeColors: { ...formData.themeColors, primary: e.target.value } 
                          })}
                          className="w-full h-[42px] border border-slate-200 rounded-xl px-2 bg-white cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Website Structure */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Albert_Sans']">Structural Sections</h2>
                    <p className="text-xs text-[#666]">Configure structural toggles and override values.</p>
                  </div>

                  <div className="space-y-4 font-['Poppins'] text-xs">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">HERO HEADING (OPTIONAL)</label>
                        <input 
                          type="text" 
                          placeholder="Blank for AI generated..."
                          value={formData.heroHeading}
                          onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">HERO SUBHEADING</label>
                        <input 
                          type="text" 
                          placeholder="Blank for AI..."
                          value={formData.heroSubheading}
                          onChange={(e) => setFormData({ ...formData, heroSubheading: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1.5">CTA BUTTON TEXT</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Schedule Call"
                          value={formData.ctaText}
                          onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#102E63] bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-500 block">CONTACT FORM</span>
                        <input 
                          type="checkbox"
                          checked={formData.contactFormRequired}
                          onChange={(e) => setFormData({ ...formData, contactFormRequired: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-500 block">WHATSAPP CHAT</span>
                        <input 
                          type="checkbox"
                          checked={formData.whatsappButtonRequired}
                          onChange={(e) => setFormData({ ...formData, whatsappButtonRequired: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-500 block">STICKY HEADER</span>
                        <input 
                          type="checkbox"
                          checked={formData.stickyHeader}
                          onChange={(e) => setFormData({ ...formData, stickyHeader: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-500 block">DARK MODE</span>
                        <input 
                          type="checkbox"
                          checked={formData.darkMode}
                          onChange={(e) => setFormData({ ...formData, darkMode: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Choose Subdomain */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Albert_Sans']">Choose Website Subdomain</h2>
                    <p className="text-xs text-[#666]">Define your unique web address. Must be unique, lowercase and no spaces.</p>
                  </div>

                  <div className="space-y-4 font-['Poppins'] text-xs">
                    <div>
                      <label className="font-bold text-slate-500 block mb-1.5">SUBDOMAIN ADDDRESS</label>
                      <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:border-[#102E63] transition-all">
                        <input 
                          type="text" 
                          placeholder="e.g. apexlegal"
                          value={formData.subdomain}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            subdomain: e.target.value.toLowerCase().replace(/\s+/g, "") 
                          })}
                          className="w-full outline-none text-slate-800 bg-transparent text-xs"
                        />
                        <span className="text-slate-400 font-semibold select-none">.sdpttech.com</span>
                      </div>
                      
                      {/* Check validation tags */}
                      <div className="mt-2 text-[11px] font-semibold flex items-center gap-1.5">
                        {checkingSubdomain && (
                          <span className="text-blue-500 animate-pulse">Checking availability...</span>
                        )}
                        {!checkingSubdomain && subdomainAvailable === true && (
                          <span className="text-green-600">✓ Address is unique and available!</span>
                        )}
                        {!checkingSubdomain && subdomainAvailable === false && (
                          <span className="text-red-500">✗ Address is already taken or invalid.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Generate */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-['Albert_Sans']">Review Website Summary</h2>
                    <p className="text-xs text-[#666]">Check details before launching the AI compilers.</p>
                  </div>

                  <div className="space-y-3 font-['Poppins'] text-xs bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-400">BUSINESS</span>
                      <span className="font-bold text-slate-800">{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-400">CATEGORY</span>
                      <span className="font-bold text-slate-800">{formData.businessCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-400">THEME TONE</span>
                      <span className="font-bold text-slate-800">{formData.websiteTone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-400">SUBDOMAIN</span>
                      <span className="font-bold text-blue-600 font-semibold">{formData.subdomain}.sdpttech.com</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Nav Buttons */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
                {step > 1 ? (
                  <Button 
                    variant="secondary" 
                    onClick={handleBack}
                    className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 px-6 py-2.5 flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <Button 
                    variant="primary" 
                    onClick={handleNext}
                    className="bg-[#102E63] hover:bg-[#0a1f44] text-white px-6 py-2.5 flex items-center gap-1 cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={handleGenerate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 shadow-lg shadow-blue-500/10 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" /> Generate Website
                  </Button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Poppins']">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#102E63] animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Loading wizard...</span>
        </div>
      </div>
    }>
      <WizardContent />
    </Suspense>
  );
}
