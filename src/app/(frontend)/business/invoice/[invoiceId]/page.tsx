import React from "react";
import dbConnect from "@/lib/mongoose";
import SaaSTransaction from "@/models/SaaSTransaction";
import { notFound } from "next/navigation";
import { ArrowLeft, Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;

  await dbConnect();
  
  // Find transaction by invoiceId. If 'demo', create a placeholder to test.
  let tx: any = null;
  if (invoiceId === "demo") {
    tx = {
      orderId: "ORD-MOCK123456",
      transactionId: "TXN-MOCK987654",
      invoiceId: "INV-2026-MOCK",
      plan: "PRO",
      amount: 235,
      currency: "INR",
      status: "success",
      paymentMethod: "card",
      cardLast4: "4567",
      billingName: "Rajesh Sen",
      billingAddress: "45, Barakhamba Road, Connaught Place",
      billingCountry: "India",
      billingState: "Delhi",
      billingCity: "New Delhi",
      billingZip: "110001",
      invoiceEmail: "rajesh@neogrowth.in",
      gstNumber: "07AAAAA1111A1Z1",
      createdAt: new Date()
    };
  } else {
    tx = await SaaSTransaction.findOne({ invoiceId: invoiceId });
    if (!tx) {
      notFound();
    }
  }

  const basePrice = tx.plan === "BUSINESS" ? 499 : 199;
  const taxAmount = Math.round(basePrice * 0.18);
  const totalAmount = tx.amount || (basePrice + taxAmount);

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6 font-['Poppins'] text-slate-800 relative antialiased">
      
      {/* Action Controls Bar */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Dynamic client print trigger */}
        <button 
          onClick={() => {
            if (typeof window !== "undefined") {
              window.print();
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Tax Invoice Shell */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 relative overflow-hidden border border-slate-200/60">
        
        {/* Dynamic Demo Watermark Background Pattern */}
        <div className="absolute inset-0 flex items-center justify-center rotate-[-30deg] pointer-events-none opacity-[0.04]">
          <span className="text-[120px] font-black tracking-widest uppercase select-none text-slate-900">DEMO INVOICE</span>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-slate-100 pb-8 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-[#102E63] text-white rounded-xl shadow-md shadow-[#102E63]/10">
                <span className="text-base font-black tracking-wider">SDPT</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#102E63] font-['Albert_Sans']">AI Website Builder</span>
            </div>
            <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full block w-fit">Tax Invoice / Receipt</span>
          </div>

          <div className="text-xs text-right sm:space-y-1">
            <span className="text-slate-400 font-bold block mb-1 sm:mb-2 uppercase tracking-wider">Invoice Details</span>
            <p className="font-bold text-slate-900">Invoice ID: <span className="uppercase text-slate-800">{tx.invoiceId}</span></p>
            <p className="font-semibold text-slate-500">Date: {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-semibold text-slate-500">Payment Status: <span className="text-emerald-600 font-bold uppercase">{tx.status}</span></p>
          </div>
        </div>

        {/* Customer & Company Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-100 text-xs">
          <div className="space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Billing Entity (Issuer)</span>
            <p className="font-bold text-slate-900">SDPT Tech Enterprises Private Limited</p>
            <p className="text-slate-500 leading-relaxed">12, Cyber Hub, DLF Phase 3,<br />Gurugram, Haryana - 122002</p>
            <p className="text-slate-500 font-bold">GSTIN: 06AAACS1234F1Z9</p>
          </div>

          <div className="space-y-2 md:text-right">
            <span className="text-slate-400 font-bold uppercase tracking-wider block">Customer Details (Recipient)</span>
            <p className="font-bold text-slate-900">{tx.billingName}</p>
            <p className="text-slate-500 leading-relaxed">{tx.billingAddress},<br />{tx.billingCity}, {tx.billingState} - {tx.billingZip}</p>
            <p className="text-slate-500 font-semibold">{tx.invoiceEmail}</p>
            {tx.gstNumber && <p className="text-slate-500 font-bold">Customer GSTIN: {tx.gstNumber}</p>}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-8">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3">Plan / Description</th>
                <th className="py-3 text-right">Quantity</th>
                <th className="py-3 text-right">Price</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 text-slate-700 font-medium">
                <td className="py-4">
                  <span className="font-bold text-slate-900 uppercase">SDPT Website Builder {tx.plan} Subscription</span>
                  <span className="block text-[10px] text-slate-400 mt-1">1-Month Premium Platform Access</span>
                </td>
                <td className="py-4 text-right">1</td>
                <td className="py-4 text-right">₹{basePrice}.00</td>
                <td className="py-4 text-right">₹{basePrice}.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end text-xs border-t border-slate-100 pt-6">
          <div className="w-full sm:w-64 space-y-3.5">
            <div className="flex justify-between items-center text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{basePrice}.00</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>GST / Taxes (18%)</span>
              <span className="font-semibold text-slate-900">₹{taxAmount}.00</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 text-slate-900">
              <span className="font-bold text-sm">Total Amount Paid</span>
              <span className="text-base font-bold text-[#102E63]">₹{totalAmount}.00</span>
            </div>
          </div>
        </div>

        {/* Transaction Reference Details */}
        <div className="mt-8 border-t border-slate-100 pt-6 bg-slate-50/50 p-4 rounded-xl space-y-2 text-[10px] text-slate-400 font-semibold">
          <p>Order Reference: <span className="uppercase text-slate-500">{tx.orderId}</span></p>
          <p>Bank Transaction ID: <span className="uppercase text-slate-500">{tx.transactionId}</span></p>
          <p>Payment Mode: <span className="uppercase text-slate-500">{tx.paymentMethod} Card ending with **** {tx.cardLast4}</span></p>
        </div>

        {/* Invoice Footer */}
        <div className="mt-12 text-center text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-6 flex items-center justify-center gap-1.5 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>This is a digitally generated demo invoice. No real amount was charged.</span>
        </div>

      </div>
    </div>
  );
}
