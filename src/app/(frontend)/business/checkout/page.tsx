"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  CreditCard, Lock, Shield, CheckCircle2, AlertCircle, 
  Loader2, Sparkles, ChevronRight, ArrowLeft, Download,
  Home, Check, Info, Settings, HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/business/Button";
import Card from "@/components/business/Card";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, data: session } = useSession();

  // Selected Plan
  const planParam = searchParams.get("plan")?.toLowerCase() || "pro";
  const planName = planParam === "business" ? "Business" : "Pro";
  const basePrice = planParam === "business" ? 499 : 199;
  const taxAmount = Math.round(basePrice * 0.18); // 18% GST
  const totalAmount = basePrice + taxAmount;

  // Checkout Steps
  const [step, setStep] = useState(1);

  // Form States
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "Finance / Accounting",
    address: "",
    gstNumber: "",
    pan: "",
    subdomain: "",
    companySize: "1-10",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    zipCode: "",
    agreeToTerms: false
  });

  const [brandPrefs, setBrandPrefs] = useState({
    theme: "Light",
    color: "#102E63",
    style: "Modern",
    description: "",
    targetAudience: "",
    primaryGoal: "Generate Leads",
    tagline: "",
    fontStyle: "Modern"
  });

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    address: "",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    zipCode: "",
    email: "",
    gstNumber: "",
    couponCode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: true
  });

  // Testing / Developer Mode Options
  const [testMode, setTestMode] = useState("success");

  // Flow State Loader & Response
  const [processing, setProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [paymentResult, setPaymentResult] = useState<any>(null); // 'success' | 'failed'
  const [failedReason, setFailedReason] = useState("");
  const [orderSummary, setOrderSummary] = useState<any>(null);

  // Confetti particles
  const [confetti, setConfetti] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/?login=true&callback=/business/checkout?plan=${planParam}`);
    }
  }, [status, router, planParam]);

  // Prepopulate email and billing name from session
  useEffect(() => {
    if (session?.user) {
      setBusinessDetails(prev => ({
        ...prev,
        ownerName: prev.ownerName || session.user?.name || "",
        email: prev.email || session.user?.email || ""
      }));
      setBillingDetails(prev => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        email: prev.email || session.user?.email || ""
      }));
    }
  }, [session]);

  // Trigger confetti particles on success
  useEffect(() => {
    if (paymentResult === "success") {
      const arr = Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6"][Math.floor(Math.random() * 6)],
        delay: Math.random() * 2
      }));
      setConfetti(arr);
    }
  }, [paymentResult]);

  // Loading animation phases
  const processingPhases = [
    "Checking Card Details...",
    "Contacting Secure Bank Server...",
    "Verifying Transaction Integrity...",
    "Generating Digital Invoice...",
    "Activating Premium Account Privileges...",
  ];

  const handlePayNow = () => {
    // Basic card validations
    if (!cardDetails.cardholderName.trim()) {
      toast.error("Please enter cardholder name.");
      return;
    }
    const cleanCard = cardDetails.cardNumber.replace(/\s/g, "");
    if (cleanCard.length !== 16 || !/^\d+$/.test(cleanCard)) {
      toast.error("Card number must be exactly 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      toast.error("Expiry must be in MM/YY format.");
      return;
    }
    if (cardDetails.cvv.length !== 3 || !/^\d+$/.test(cardDetails.cvv)) {
      toast.error("CVV must be exactly 3 digits.");
      return;
    }

    setProcessing(true);
    setProgressStep(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < processingPhases.length - 1) {
        currentStep += 1;
        setProgressStep(currentStep);
      } else {
        clearInterval(interval);
        completePaymentSimulation();
      }
    }, 900);
  };

  const completePaymentSimulation = async () => {
    const isSuccess = testMode === "success";
    const mappedReasons: Record<string, string> = {
      failed: "Declined by card issuer. Please try a different card.",
      balance: "Insufficient funds. Please verify card balance.",
      expired: "The card date has expired. Verification failed.",
      cvv: "Incorrect security CVV code provided.",
      timeout: "Network timeout communicating with banking gateway."
    };

    if (isSuccess) {
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: planName,
            amount: totalAmount,
            billingDetails: {
              name: billingDetails.name,
              address: billingDetails.address,
              country: billingDetails.country,
              state: billingDetails.state,
              city: billingDetails.city,
              zip: billingDetails.zipCode,
              email: billingDetails.email,
              gst: billingDetails.gstNumber
            },
            cardDetails: {
              number: cardDetails.cardNumber
            },
            transactionStatus: "success"
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setPaymentResult("success");
          setOrderSummary(data);
          toast.success("Payment completed successfully!");
        } else {
          setPaymentResult("failed");
          setFailedReason(data.message || "Failed to finalize subscription state.");
        }
      } catch (e) {
        setPaymentResult("failed");
        setFailedReason("API connection error during subscription activation.");
      } finally {
        setProcessing(false);
      }
    } else {
      // Log failed transaction log in DB
      try {
        await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: planName,
            amount: totalAmount,
            billingDetails: {
              name: billingDetails.name,
              address: billingDetails.address,
              country: billingDetails.country,
              state: billingDetails.state,
              city: billingDetails.city,
              zip: billingDetails.zipCode,
              email: billingDetails.email,
              gst: billingDetails.gstNumber
            },
            cardDetails: {
              number: cardDetails.cardNumber
            },
            transactionStatus: "failed",
            failureReason: mappedReasons[testMode] || "Transaction cancelled."
          })
        });
      } catch (err) {
        console.error(err);
      }

      setPaymentResult("failed");
      setFailedReason(mappedReasons[testMode] || "Transaction cancelled by client.");
      setProcessing(false);
      toast.error("Payment failed. Please review details.");
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const formatted = rawVal.match(/.{1,4}/g)?.join(" ") || rawVal;
    setCardDetails({ ...cardDetails, cardNumber: formatted.slice(0, 19) });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    setCardDetails({ ...cardDetails, expiry: val.slice(0, 5) });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Poppins']">
        <Loader2 className="w-8 h-8 text-[#102E63] animate-spin" />
      </div>
    );
  }

  // Steps Navigator Headers
  const stepsHeaders = [
    "Plan Summary",
    "Business Details",
    "Brand Preferences",
    "Billing Details",
    "Payment Method",
    "Secure Payment"
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 font-['Poppins'] text-slate-800 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-10 bg-blue-500" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-10 bg-indigo-600" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* PROCESSING LOADER STATE */}
        {processing && (
          <div className="min-h-[500px] flex flex-col items-center justify-center bg-white border border-gray-100/50 rounded-3xl p-12 shadow-xl space-y-8 max-w-2xl mx-auto">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <Lock className="w-5 h-5 text-blue-600 absolute" />
            </div>
            
            <div className="space-y-4 text-center w-full max-w-md">
              <h3 className="text-lg font-bold text-slate-900 font-['Albert_Sans']">Securing Transaction</h3>
              <p className="text-xs text-slate-500 font-medium">Please do not refresh the page or click back. We are processing your subscription request safely.</p>
              
              {/* Progress Steps Indicators */}
              <div className="pt-6 space-y-3.5 text-left max-w-xs mx-auto">
                {processingPhases.map((phase, idx) => {
                  const isActive = idx === progressStep;
                  const isDone = idx < progressStep;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {isDone ? (
                        <div className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[9px]">✓</div>
                      ) : isActive ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-200 rounded-full" />
                      )}
                      <span className={`font-bold transition-colors ${isActive ? "text-blue-600" : isDone ? "text-slate-500" : "text-slate-300"}`}>
                        {phase}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT SUCCESS SCREEN */}
        {paymentResult === "success" && (
          <div className="relative min-h-[550px] bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto overflow-hidden">
            
            {/* Custom Confetti Animation */}
            {confetti.map((c) => (
              <div 
                key={c.id} 
                className="absolute rounded-full pointer-events-none animate-bounce"
                style={{
                  left: `${c.x}%`,
                  top: `${c.y}%`,
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  backgroundColor: c.color,
                  opacity: 0.6,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}

            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
                ✓
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Payment Successful!</h2>
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-3.5 py-1 rounded-full w-fit mx-auto">Premium Plan Activated</p>
              </div>

              {/* Order Invoice Details Panel */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 space-y-4 text-xs text-left">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3.5">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">ORDER ID</span>
                    <span className="font-bold text-slate-800 uppercase">{orderSummary?.transaction?.orderId || "ORD-MOCK"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">TRANSACTION ID</span>
                    <span className="font-bold text-slate-800 uppercase">{orderSummary?.transaction?.transactionId || "TXN-MOCK"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3.5">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">INVOICE ID</span>
                    <span className="font-bold text-slate-800 uppercase">{orderSummary?.transaction?.invoiceId || "INV-MOCK"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">PLAN ACTIVATED</span>
                    <span className="font-bold text-blue-600 uppercase font-extrabold">{planName} Premium</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">AMOUNT PAID</span>
                    <span className="font-bold text-slate-800">₹{totalAmount}.00</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">PAYMENT METHOD</span>
                    <span className="font-bold text-slate-800">Card ending with **** {cardDetails.cardNumber.slice(-4) || "4567"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4.5 pt-4">
                <a href={`/business/invoice/${orderSummary?.transaction?.invoiceId || "demo"}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="secondary" className="w-full font-bold flex items-center justify-center gap-2 py-4.5 border border-slate-200">
                    <Download className="w-4 h-4" /> Download Invoice
                  </Button>
                </a>
                <Button 
                  variant="primary" 
                  onClick={() => router.push(`/builder/wizard?upgrade=${planName.toLowerCase()}`)}
                  className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-4.5 shadow-lg shadow-blue-500/10"
                >
                  Create Website <Sparkles className="w-4 h-4" />
                </Button>
              </div>

              <a 
                href="/dashboard"
                className="text-xs font-bold text-slate-400 hover:text-[#102E63] transition-colors block mt-2"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        )}

        {/* PAYMENT FAILED SCREEN */}
        {paymentResult === "failed" && (
          <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-xl max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm font-bold">
              !
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Payment Failed</h2>
              <p className="text-xs text-red-500 font-bold bg-red-50 px-3.5 py-1 rounded-full w-fit mx-auto">{failedReason || "Your transaction was declined."}</p>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto font-['Poppins'] leading-relaxed">
              We were unable to verify your billing transaction. Please review your banking credentials, confirm card details, or select an alternative sandbox testing outcome.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 max-w-md mx-auto">
              <Button 
                variant="secondary" 
                onClick={() => { setPaymentResult(null); setStep(1); }}
                className="flex-1 py-4 border border-slate-200"
              >
                Back to Plan
              </Button>
              <Button 
                variant="primary" 
                onClick={() => { setPaymentResult(null); setStep(6); }}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* ACTIVE CHECKOUT FORM CONTAINER */}
        {paymentResult === null && !processing && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Flow Progress and Inputs */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Checkout Progress Stepper */}
              <div className="border border-gray-100/50 bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-3">
                  <span>Step {step} of 6</span>
                  <span className="text-blue-600">{stepsHeaders[step - 1]}</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const stepNum = idx + 1;
                    return (
                      <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          stepNum <= step ? "bg-blue-600" : "bg-slate-100"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Step Panels */}
              <div className="border border-gray-100/50 bg-white rounded-3xl p-8 shadow-sm">
                
                {/* STEP 1: PLAN SUMMARY */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Plan Summary</h2>
                      <p className="text-xs text-slate-500">Verify your selected package details and inclusions.</p>
                    </div>

                    <div className="flex justify-between items-center border brand-border brand-card-bg p-5 rounded-2xl">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">SELECTED PLAN</span>
                        <span className="text-base font-bold text-slate-900 heading-font">{planName} Premium</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">₹{basePrice}/mo</span>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-600 uppercase block">INCLUDED PRIVILEGES</span>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-700">
                        {(planParam === "business" 
                          ? ["Everything in Pro", "Multiple store locations", "Custom Lead Capture API", "Staff management console", "Dedicated account support", "AI copywriter widget"]
                          : ["Remove SDPT branding", "Premium domain mapping", "Advanced analytics dashboard", "Customer reviews widget", "SEO optimization tool", "Priority support"]
                        ).map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-[9px]">✓</div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        variant="primary" 
                        onClick={() => setStep(2)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 text-xs py-4 flex items-center gap-1"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: BUSINESS DETAILS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Business Details</h2>
                      <p className="text-xs text-slate-500">Provide registration inputs to configure your system.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Business Name *</label>
                        <input 
                          type="text" 
                          required
                          value={businessDetails.businessName}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, businessName: e.target.value })}
                          placeholder="e.g. Acme Corporation"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Owner Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={businessDetails.ownerName}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, ownerName: e.target.value })}
                          placeholder="Owner name"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={businessDetails.email}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, email: e.target.value })}
                          placeholder="name@company.com"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Mobile Number *</label>
                        <input 
                          type="tel" 
                          required
                          value={businessDetails.phone}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, phone: e.target.value })}
                          placeholder="10-digit number"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Business Category *</label>
                        <select 
                          value={businessDetails.category}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, category: e.target.value })}
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        >
                          <option>Finance / Accounting</option>
                          <option>Law Firm</option>
                          <option>Restaurant / Cafe</option>
                          <option>Clinic / Healthcare</option>
                          <option>Education / School</option>
                          <option>Real Estate</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Website Subdomain *</label>
                        <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-white">
                          <input 
                            type="text" 
                            required
                            value={businessDetails.subdomain}
                            onChange={(e) => setBusinessDetails({ ...businessDetails, subdomain: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                            placeholder="acme"
                            className="w-full py-3 outline-none bg-transparent"
                          />
                          <span className="text-slate-400 font-semibold">.sdpttech.com</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">GST Number (Optional)</label>
                        <input 
                          type="text" 
                          value={businessDetails.gstNumber}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, gstNumber: e.target.value.toUpperCase() })}
                          placeholder="e.g. 07AAAAA1111A1Z1"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">PAN Number (Optional)</label>
                        <input 
                          type="text" 
                          value={businessDetails.pan}
                          onChange={(e) => setBusinessDetails({ ...businessDetails, pan: e.target.value.toUpperCase() })}
                          placeholder="e.g. ABCDE1234F"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={businessDetails.agreeToTerms}
                        onChange={(e) => setBusinessDetails({ ...businessDetails, agreeToTerms: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 border-gray-300"
                      />
                      <label htmlFor="terms" className="font-semibold cursor-pointer">I agree to the Premium Terms & Privacy Policies.</label>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button 
                        variant="secondary" 
                        onClick={() => setStep(1)}
                        className="py-3 px-6 border border-slate-200 text-xs flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          if (!businessDetails.businessName.trim() || !businessDetails.ownerName.trim() || !businessDetails.email.trim() || !businessDetails.phone.trim() || !businessDetails.subdomain.trim()) {
                            toast.error("Please fill all required inputs.");
                            return;
                          }
                          if (!businessDetails.agreeToTerms) {
                            toast.error("You must agree to the Terms.");
                            return;
                          }
                          setStep(3);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 text-xs py-4 flex items-center gap-1"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 3: BRAND PREFERENCES */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Brand Preferences</h2>
                      <p className="text-xs text-slate-500">Provide preferences for the AI website custom style builder.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Business Theme</label>
                        <select 
                          value={brandPrefs.theme}
                          onChange={(e) => setBrandPrefs({ ...brandPrefs, theme: e.target.value })}
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        >
                          <option>Light</option>
                          <option>Dark</option>
                          <option>Auto</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Preferred Color</label>
                        <input 
                          type="color" 
                          value={brandPrefs.color}
                          onChange={(e) => setBrandPrefs({ ...brandPrefs, color: e.target.value })}
                          className="w-full h-[42px] px-1 py-1 rounded-xl border border-gray-200 outline-none bg-white cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Website Style</label>
                        <select 
                          value={brandPrefs.style}
                          onChange={(e) => setBrandPrefs({ ...brandPrefs, style: e.target.value })}
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        >
                          <option>Modern</option>
                          <option>Elegant</option>
                          <option>Minimal</option>
                          <option>Corporate</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Brand Tagline</label>
                        <input 
                          type="text" 
                          value={brandPrefs.tagline}
                          onChange={(e) => setBrandPrefs({ ...brandPrefs, tagline: e.target.value })}
                          placeholder="e.g. Empowering Local Commerce"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Preferred Font Style</label>
                        <select 
                          value={brandPrefs.fontStyle}
                          onChange={(e) => setBrandPrefs({ ...brandPrefs, fontStyle: e.target.value })}
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        >
                          <option>Modern (Inter / Space Grotesk)</option>
                          <option>Elegant (Playfair Display / Sora)</option>
                          <option>Corporate (Manrope / Outfit)</option>
                          <option>Minimal (Urbanist / Poppins)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-xs">
                      <label className="font-bold text-slate-500 uppercase">Business Description *</label>
                      <textarea 
                        rows={3}
                        required
                        value={brandPrefs.description}
                        onChange={(e) => setBrandPrefs({ ...brandPrefs, description: e.target.value })}
                        placeholder="Detail your key products, target audience, and brand values..."
                        className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button 
                        variant="secondary" 
                        onClick={() => setStep(2)}
                        className="py-3 px-6 border border-slate-200 text-xs flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          if (!brandPrefs.description.trim()) {
                            toast.error("Please enter a business description.");
                            return;
                          }
                          setStep(4);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 text-xs py-4 flex items-center gap-1"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: BILLING DETAILS */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Billing Details</h2>
                      <p className="text-xs text-slate-500">Provide details for invoice generation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Billing Name *</label>
                        <input 
                          type="text" 
                          required
                          value={billingDetails.name}
                          onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
                          placeholder="Full Name"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Invoice Email *</label>
                        <input 
                          type="email" 
                          required
                          value={billingDetails.email}
                          onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
                          placeholder="billing@company.com"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Billing Address *</label>
                        <input 
                          type="text" 
                          required
                          value={billingDetails.address}
                          onChange={(e) => setBillingDetails({ ...billingDetails, address: e.target.value })}
                          placeholder="Billing Street, Suite"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Country *</label>
                        <input 
                          type="text" 
                          required
                          value={billingDetails.country}
                          onChange={(e) => setBillingDetails({ ...billingDetails, country: e.target.value })}
                          placeholder="India"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">State *</label>
                        <input 
                          type="text" 
                          required
                          value={billingDetails.state}
                          onChange={(e) => setBillingDetails({ ...billingDetails, state: e.target.value })}
                          placeholder="Delhi"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">City *</label>
                        <input 
                          type="text" 
                          required
                          value={billingDetails.city}
                          onChange={(e) => setBillingDetails({ ...billingDetails, city: e.target.value })}
                          placeholder="New Delhi"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">ZIP / Pincode *</label>
                        <input 
                          type="text" 
                          required
                          value={billingDetails.zipCode}
                          onChange={(e) => setBillingDetails({ ...billingDetails, zipCode: e.target.value })}
                          placeholder="110001"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button 
                        variant="secondary" 
                        onClick={() => setStep(3)}
                        className="py-3 px-6 border border-slate-200 text-xs flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          if (!billingDetails.name.trim() || !billingDetails.address.trim() || !billingDetails.zipCode.trim() || !billingDetails.email.trim()) {
                            toast.error("Please fill all required billing details.");
                            return;
                          }
                          setStep(5);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 text-xs py-4 flex items-center gap-1"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 5: PAYMENT METHOD */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Payment Method</h2>
                      <p className="text-xs text-slate-500">Select your preferred payment gateway simulator option.</p>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { id: "card", label: "Credit Card / Debit Card", desc: "Simulate secure multi-issuer card payment processing." },
                        { id: "upi", label: "UPI (Paytm / Google Pay / PhonePe)", desc: "Quick verification via mock virtual payment address." },
                        { id: "netbank", label: "Net Banking", desc: "Select and authenticate via major Indian banking hosts." },
                        { id: "wallet", label: "Digital Wallet", desc: "Pay using simulated prepaid wallet balances." }
                      ].map((pm) => (
                        <div 
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${
                            paymentMethod === pm.id 
                              ? "border-blue-600 bg-blue-50/10" 
                              : "border-slate-100 hover:bg-slate-50"
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={paymentMethod === pm.id}
                            onChange={() => setPaymentMethod(pm.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{pm.label}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{pm.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button 
                        variant="secondary" 
                        onClick={() => setStep(4)}
                        className="py-3 px-6 border border-slate-200 text-xs flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          if (paymentMethod !== "card") {
                            toast.error("For simulation, only card checkout is fully validated. Please select Card.");
                            return;
                          }
                          setStep(6);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 text-xs py-4 flex items-center gap-1"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 6: CARD DETAILS */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 font-['Albert_Sans']">Secure Credit Card Checkout</h2>
                      <p className="text-xs text-slate-500">Provide payment card details to initiate processing.</p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Cardholder Name *</label>
                        <input 
                          type="text" 
                          required
                          value={cardDetails.cardholderName}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                          placeholder="e.g. RAJESH KUMAR SEN"
                          className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white font-semibold uppercase"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-500 uppercase">Card Number *</label>
                        <div className="flex items-center border border-gray-200 rounded-xl px-4 bg-white">
                          <input 
                            type="text" 
                            required
                            value={cardDetails.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="xxxx xxxx xxxx xxxx"
                            className="w-full py-3 outline-none bg-transparent tracking-widest font-semibold"
                          />
                          <CreditCard className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="font-bold text-slate-500 uppercase">Expiry Date *</label>
                          <input 
                            type="text" 
                            required
                            value={cardDetails.expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white font-semibold tracking-wider"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="font-bold text-slate-500 uppercase">Security CVV *</label>
                          <input 
                            type="password" 
                            required
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                            placeholder="123"
                            className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-white font-semibold tracking-widest"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <input 
                          type="checkbox" 
                          id="save"
                          checked={cardDetails.saveCard}
                          onChange={(e) => setCardDetails({ ...cardDetails, saveCard: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="save" className="font-semibold cursor-pointer">Save card credentials securely (visual indicator only).</label>
                      </div>
                    </div>

                    {/* Visual Security Badges */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4 text-[9px] font-bold text-slate-400">
                      <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-500" /> SSL SECURED</span>
                      <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-500" /> 256-BIT ENCRYPTION</span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> PCI-DSS COMPLIANT</span>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button 
                        variant="secondary" 
                        onClick={() => setStep(5)}
                        className="py-3 px-6 border border-slate-200 text-xs flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={handlePayNow}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 text-xs py-4 flex items-center gap-1.5"
                      >
                        Pay Now <Lock className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Column: Sticky Order Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
              <div className="border border-gray-100/50 bg-white rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 font-['Albert_Sans']">Order Summary</h3>
                
                <div className="space-y-4.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>{planName} Plan (Monthly)</span>
                    <span className="font-semibold text-slate-900">₹{basePrice}.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Taxes (18% GST)</span>
                    <span className="font-semibold text-slate-900">₹{taxAmount}.00</span>
                  </div>

                  {billingDetails.couponCode.toUpperCase() === "WELCOME50" && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg text-[10px]">
                      <span>Discount (WELCOME50)</span>
                      <span>-₹{Math.round(totalAmount * 0.5)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-slate-900">
                    <span className="font-bold">Total Due</span>
                    <span className="text-lg font-bold text-slate-900">
                      ₹{billingDetails.couponCode.toUpperCase() === "WELCOME50" ? Math.round(totalAmount * 0.5) : totalAmount}.00
                    </span>
                  </div>
                </div>

                {/* Coupon Code Box */}
                {step < 5 && (
                  <div className="pt-2">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">Apply Discount Coupon</label>
                    <div className="flex items-center border border-gray-200 rounded-xl px-2 bg-slate-50/50">
                      <input 
                        type="text" 
                        value={billingDetails.couponCode}
                        onChange={(e) => setBillingDetails({ ...billingDetails, couponCode: e.target.value })}
                        placeholder="e.g. WELCOME50"
                        className="w-full py-2.5 px-1 outline-none text-xs bg-transparent uppercase"
                      />
                      {billingDetails.couponCode.toUpperCase() === "WELCOME50" && (
                        <span className="text-[9px] font-bold text-emerald-600 uppercase pr-1">APPLIED</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Poppins']">
        <Loader2 className="w-8 h-8 text-[#102E63] animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
