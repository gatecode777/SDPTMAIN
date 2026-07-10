"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/business/Button";
import Card from "@/components/business/Card";
import { 
  Globe, ExternalLink, Trash2, Edit3, Loader2, Sparkles,
  CreditCard, Calendar, CheckCircle, XCircle, FileText, Settings, ShieldAlert
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubdomain, setNewSubdomain] = useState("");
  const [updating, setUpdating] = useState(false);

  // Billing & Subscription states
  const [subscription, setSubscription] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"sites" | "billing">("sites");
  const [billingLoading, setBillingLoading] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true&callback=/dashboard");
    }
  }, [status, router]);

  const fetchWebsites = async () => {
    try {
      const res = await fetch("/api/builder/user-websites");
      const data = await res.json();
      if (res.ok) {
        setWebsites(data.websites || []);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load websites.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingData = async () => {
    try {
      setBillingLoading(true);
      const subRes = await fetch("/api/billing/checkout");
      const subData = await subRes.json();
      if (subRes.ok) {
        setSubscription(subData.subscription);
      }

      const historyRes = await fetch("/api/billing/history");
      const historyData = await historyRes.json();
      if (historyRes.ok) {
        setHistory(historyData.transactions || []);
      }
    } catch (e) {
      console.error("Fetch billing error:", e);
    } finally {
      setBillingLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchWebsites();
      fetchBillingData();
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this website? This action is permanent.")) return;
    try {
      const res = await fetch(`/api/builder/user-websites?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Website deleted successfully.");
        setWebsites(websites.filter((w) => w._id !== id));
      } else {
        toast.error("Failed to delete website.");
      }
    } catch (e) {
      console.error(e);
      toast.error("API error deleting website.");
    }
  };

  const handleUpdateSubdomain = async (id: string) => {
    if (!newSubdomain) {
      toast.error("Please enter a valid subdomain.");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch("/api/builder/user-websites", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, subdomain: newSubdomain }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Subdomain updated successfully!");
        setWebsites(websites.map((w) => w._id === id ? { ...w, subdomain: data.website.subdomain } : w));
        setEditingId(null);
        setNewSubdomain("");
      } else {
        toast.error(data.message || "Failed to update subdomain.");
      }
    } catch (e) {
      console.error(e);
      toast.error("API error updating subdomain.");
    } finally {
      setUpdating(false);
    }
  };

  // Subscription Actions
  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription renewal? Paid privileges remain active until period end.")) return;
    setSubmittingAction(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Subscription renewal cancelled.");
        setSubscription(data.subscription);
        fetchBillingData();
      } else {
        toast.error("Failed to cancel subscription.");
      }
    } catch (e) {
      console.error(e);
      toast.error("API error updating subscription.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRenewSubscription = async () => {
    setSubmittingAction(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "renew" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Subscription renewed successfully!");
        setSubscription(data.subscription);
        fetchBillingData();
      } else {
        toast.error("Failed to renew subscription.");
      }
    } catch (e) {
      console.error(e);
      toast.error("API error renewing subscription.");
    } finally {
      setSubmittingAction(false);
    }
  };

  if (status === "loading" || loading || billingLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Poppins']">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#102E63] animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  const getSubdomainLink = (sub: string) => {
    if (typeof window !== "undefined") {
      const isLocal = window.location.host.includes("localhost");
      if (isLocal) {
        return `http://${sub}.localhost:3000`;
      }
      return `https://${sub}.sdpttech.com`;
    }
    return `https://${sub}.sdpttech.com`;
  };

  const getPlanBadge = (plan: string) => {
    if (plan === "BUSINESS") {
      return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider block w-fit">Business Tiers</span>;
    }
    if (plan === "PRO") {
      return <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider block w-fit font-extrabold">Pro Premium</span>;
    }
    return <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider block w-fit">Free Plan</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 font-['Poppins'] text-slate-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Header Console */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Albert_Sans'] flex items-center gap-2">
                My Workspace
                {subscription && subscription.plan !== "FREE" && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wider">PREMIUM</span>
                )}
              </h1>
              <p className="text-xs text-[#666] mt-0.5">
                Manage your AI-generated subdomains, analytics, and subscription details.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold mr-2">
              <button 
                onClick={() => setActiveTab("sites")}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === "sites" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Websites
              </button>
              <button 
                onClick={() => setActiveTab("billing")}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === "billing" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                Billing & Plan
              </button>
            </div>

            <Button 
              variant="primary" 
              onClick={() => router.push("/builder/wizard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md py-3 px-6 text-xs w-fit"
            >
              <Sparkles className="w-4 h-4" /> Create New Site
            </Button>
          </div>
        </div>

        {/* WEBSITES WORKSPACE GRID TAB */}
        {activeTab === "sites" && (
          websites.length === 0 ? (
            <Card hoverLift={false} className="bg-white border border-slate-100 p-12 text-center max-w-xl mx-auto rounded-3xl space-y-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto animate-none">
                <Globe className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 font-['Albert_Sans']">No Websites Generated</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  You haven't generated any AI websites yet. Click below to launch the website creation wizard.
                </p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => router.push("/builder/wizard")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold mx-auto cursor-pointer"
              >
                Get Started Free
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {websites.map((web) => (
                <Card 
                  key={web._id}
                  hoverLift={true}
                  className="bg-white border border-slate-100 p-6 flex flex-col justify-between rounded-3xl shadow-sm relative overflow-hidden"
                >
                  <div>
                    {/* Category indicator */}
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-4">
                      {web.businessCategory}
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 tracking-tight font-['Albert_Sans'] mb-1">
                      {web.businessName}
                    </h3>
                    
                    {/* Address preview */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold mb-4">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{web.subdomain}.sdpttech.com</span>
                    </div>

                    <p className="text-xs text-[#666] leading-relaxed line-clamp-3 mb-6">
                      {web.businessDescription}
                    </p>
                  </div>

                  {/* Inline Domain Editor */}
                  {editingId === web._id ? (
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 mb-4 text-xs">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
                        <input 
                          type="text" 
                          placeholder="newname"
                          value={newSubdomain}
                          onChange={(e) => setNewSubdomain(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                          className="w-full outline-none text-slate-800 text-xs bg-transparent"
                        />
                        <span className="text-slate-400 font-semibold">.sdpttech.com</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleUpdateSubdomain(web._id)}
                          disabled={updating}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded text-[10px] cursor-pointer"
                        >
                          {updating ? "Saving..." : "Save"}
                        </Button>
                        <Button 
                          onClick={() => { setEditingId(null); setNewSubdomain(""); }}
                          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-1.5 px-3 rounded text-[10px] cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <a 
                      href={getSubdomainLink(web.subdomain)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Visit Site <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingId(web._id);
                          setNewSubdomain(web.subdomain);
                        }}
                        className="p-2 text-slate-400 hover:text-[#102E63] hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                        title="Edit Subdomain"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(web._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        title="Delete Website"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        )}

        {/* BILLING AND PREMIUM PLAN DETAILS TAB */}
        {activeTab === "billing" && (
          <div className="space-y-8">
            
            {/* Top Subscription Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Plan Management Card */}
              <Card hoverLift={false} className="bg-white border border-slate-100 p-6 rounded-3xl md:col-span-2 flex flex-col justify-between shadow-sm min-h-[220px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Plan Tiers</span>
                      <h3 className="text-xl font-bold text-slate-900 font-['Albert_Sans'] flex items-center gap-2">
                        {subscription ? subscription.plan : "FREE"} Subscription
                      </h3>
                    </div>
                    {getPlanBadge(subscription ? subscription.plan : "FREE")}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-bold text-[10px] text-slate-400 block uppercase">START DATE</span>
                        <span>
                          {subscription?.activationDate 
                            ? new Date(subscription.activationDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-bold text-[10px] text-slate-400 block uppercase">RENEWAL DATE</span>
                        <span>
                          {subscription?.expiryDate 
                            ? new Date(subscription.expiryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscriptions Actions Controls */}
                <div className="flex items-center gap-3 pt-6 border-t border-slate-50 mt-4 text-xs font-bold">
                  {subscription && subscription.plan !== "FREE" ? (
                    <>
                      {subscription.status === "cancelled" ? (
                        <>
                          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
                            <ShieldAlert className="w-4 h-4" /> Renewal Cancelled
                          </div>
                          <Button 
                            variant="primary" 
                            disabled={submittingAction}
                            onClick={handleRenewSubscription}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Re-Activate Renewal
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                            <CheckCircle className="w-4 h-4" /> Auto-Renewing
                          </div>
                          <Button 
                            variant="secondary" 
                            disabled={submittingAction}
                            onClick={handleCancelSubscription}
                            className="text-red-600 border border-red-200 hover:bg-red-50 py-2.5 px-5 text-xs font-bold rounded-xl cursor-pointer ml-auto"
                          >
                            Cancel Renewal
                          </Button>
                        </>
                      )}
                      
                      {subscription.plan === "PRO" && (
                        <Button 
                          variant="primary" 
                          onClick={() => router.push("/business/checkout?plan=business")}
                          className="bg-[#102E63] hover:bg-[#0a1f44] text-white py-2.5 px-5 text-xs font-bold rounded-xl cursor-pointer ml-2"
                        >
                          Upgrade to Business
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={() => router.push("/business/checkout?plan=pro")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-xs shadow-md"
                    >
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </Card>

              {/* Status Visual card */}
              <Card hoverLift={false} className="bg-[#102E63] text-white p-6 rounded-3xl flex flex-col justify-between shadow-sm min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest block">Premium Subscription status</span>
                  <h4 className="text-base font-bold font-['Albert_Sans']">Secure Demonstration Platform</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-['Poppins']">
                    Your subscription features active white-label domains, high contrast contrast-checking algorithms, and responsive wizard presets.
                  </p>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-white/10 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" /> SSL-Secure Sandbox
                </div>
              </Card>
            </div>

            {/* Invoices & Payments History Table */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-['Albert_Sans']">Payment & Billing History</h3>
              
              {history.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 font-medium">
                  No payment transaction logs registered for this workspace account.
                </div>
              ) : (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Transaction ID</th>
                        <th className="py-3 px-3">Plan</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((tx) => (
                        <tr key={tx._id} className="border-b border-slate-50 text-slate-600 font-semibold hover:bg-slate-50/50">
                          <td className="py-4.5 px-3 uppercase text-slate-800 font-bold">{tx.orderId}</td>
                          <td className="py-4.5 px-3 uppercase">{tx.transactionId}</td>
                          <td className="py-4.5 px-3 font-bold text-blue-600 uppercase">{tx.plan}</td>
                          <td className="py-4.5 px-3 text-slate-900 font-bold">₹{tx.amount}.00</td>
                          <td className="py-4.5 px-3 font-medium text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4.5 px-3">
                            {tx.status === "success" ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">SUCCESS</span>
                            ) : (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider">FAILED</span>
                            )}
                          </td>
                          <td className="py-4.5 px-3 text-right">
                            {tx.status === "success" && (
                              <a 
                                href={`/business/invoice/${tx.invoiceId}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors font-bold"
                              >
                                <FileText className="w-4 h-4" /> View Invoice
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
