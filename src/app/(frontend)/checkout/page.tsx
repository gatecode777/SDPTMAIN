"use client";

import React, { useContext, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMapPin, FiCreditCard, FiCheckCircle, FiChevronRight, FiBox, FiPhone, FiUser, FiTruck } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import { useSession } from "next-auth/react";
import { getUserData } from "@/actions/user-sync";
import { createOrder } from "@/actions/order";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "./CheckoutFlow.css";

const CheckoutFlowContent = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1); 
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentInfo, setPaymentInfo] = useState({ cardLast4: "", upiId: "" });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      setTimeout(() => {
        window.dispatchEvent(new Event('openAuthModal'));
      }, 100);
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (status === "authenticated") {
        const res = await getUserData();
        if (res.success) {
          setAddresses(res.addresses || []);
          
          const def = res.addresses?.find((a: any) => a.isDefault);
          if (def) setSelectedAddress(def);
        }
      }
    };
    fetchAddresses();
  }, [status]);

  if (status === "loading" || !session) return <div className="checkout-loading">Verifying session...</div>;
  if (cart.length === 0 && !isPlacingOrder) {
    return (
      <div className="checkout-empty">
        <FiBox size={64} />
        <h2>Your cart is empty</h2>
        <p>You need to add items to your cart before you can checkout.</p>
        <Link href="/shop" className="primary-btn">Go to Shop</Link>
      </div>
    );
  }

  const getNumPrice = (p: any) => typeof p === 'string' ? parseInt(p.replace(/[^\d]/g, ''), 10) : p;
  const fmt = (n: any) => "₹" + Number(n).toLocaleString("en-IN");
  
  const subtotal = cart.reduce((a: number, i: any) => a + (getNumPrice(i.price) * i.qty), 0);
  const shipping = subtotal > 5000 ? 0 : 499;
  const total = subtotal + shipping;

  const handleNextStep = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    
    if (paymentMethod === 'CARD' && !paymentInfo.cardLast4) {
      toast.error("Please enter card last 4 digits");
      return;
    }
    if (paymentMethod === 'UPI' && !paymentInfo.upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData = {
        items: cart.map((i: any) => ({
          product: i.id || i._id,
          name: i.name,
          quantity: i.qty,
          price: getNumPrice(i.price)
        })),
        totalAmount: total,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          addressLine1: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.zipCode,
          country: "India",
          phone: selectedAddress.phone || "N/A"
        },
        paymentMethod: paymentMethod,
        paymentDetails: {
          cardLast4: paymentMethod === 'CARD' ? paymentInfo.cardLast4 : undefined,
          upiId: paymentMethod === 'UPI' ? paymentInfo.upiId : undefined,
          transactionId: paymentMethod !== 'COD' ? `TXN${Date.now()}` : undefined,
          paymentTimestamp: paymentMethod !== 'COD' ? new Date() : undefined
        },
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED'
      };

      const res = await createOrder(orderData);
      if (res.success) {
        clearCart();
        Swal.fire({
          title: "Order Placed!",
          text: `Your order #${res.order.orderId} has been placed successfully.`,
          icon: "success",
          confirmButtonText: "View My Orders",
          confirmButtonColor: "#111"
        }).then(() => {
          router.push("/account?tab=orders");
        });
      } else {
        toast.error(res.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-flow-page">
      <div className="checkout-flow-container">
        <div className="checkout-main">
          {}
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-icon">{step > 1 ? <FiCheckCircle /> : <FiMapPin />}</div>
              <span>Shipping</span>
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-icon"><FiCreditCard /></div>
              <span>Payment</span>
            </div>
          </div>

          {step === 1 && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Select Delivery Address</h2>
              <div className="address-grid">
                {addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <div 
                      key={addr._id} 
                      className={`address-card ${selectedAddress?._id === addr._id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <div className="addr-badge">{addr.label}</div>
                      <h4 className="addr-name"><FiUser size={14} /> {addr.fullName}</h4>
                      {addr.phone && <p className="addr-phone" style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}><FiPhone size={12} style={{ display: 'inline', marginRight: '5px' }} /> {addr.phone}</p>}
                      <p className="addr-text">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                      <div className="selected-indicator"><FiCheckCircle /></div>
                    </div>
                  ))
                ) : (
                  <div className="no-address-box">
                    <p>No addresses found in your profile.</p>
                    <Link href="/account?tab=address" className="secondary-btn">Add New Address</Link>
                  </div>
                )}
              </div>
              
              <div className="step-actions">
                <Link href="/cart" className="back-link">Return to Cart</Link>
                <button className="next-btn" onClick={handleNextStep} disabled={!selectedAddress}>
                  Continue to Payment <FiChevronRight />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content animate-fade-in">
              <h2 className="step-title">Choose Payment Method</h2>
              <div className="payment-options">
                <div 
                  className={`payment-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="payment-icon"><FiTruck /></div>
                  <div className="payment-info">
                    <h4>Cash on Delivery (COD)</h4>
                    <p>Pay with cash when your order is delivered.</p>
                  </div>
                  <div className="selected-indicator"><FiCheckCircle /></div>
                </div>

                <div 
                  className={`payment-card ${paymentMethod === 'CARD' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('CARD')}
                >
                  <div className="payment-icon"><FiCreditCard /></div>
                  <div className="payment-info">
                    <h4>Card Payment</h4>
                    <p>Pay securely with your credit or debit card.</p>
                    {paymentMethod === 'CARD' && (
                      <input 
                        type="text" 
                        placeholder="Card Last 4 Digits" 
                        maxLength={4}
                        className="payment-input"
                        value={paymentInfo.cardLast4}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardLast4: e.target.value})}
                      />
                    )}
                  </div>
                  <div className="selected-indicator"><FiCheckCircle /></div>
                </div>

                <div 
                  className={`payment-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <div className="payment-icon"><FiCheckCircle /></div>
                  <div className="payment-info">
                    <h4>UPI Payment</h4>
                    <p>Pay using GPay, PhonePe, or UPI ID.</p>
                    {paymentMethod === 'UPI' && (
                      <input 
                        type="text" 
                        placeholder="Enter UPI ID (e.g. user@okaxis)" 
                        className="payment-input"
                        value={paymentInfo.upiId}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setPaymentInfo({...paymentInfo, upiId: e.target.value})}
                      />
                    )}
                  </div>
                  <div className="selected-indicator"><FiCheckCircle /></div>
                </div>
              </div>

              <div className="step-actions">
                <button className="back-link-btn" onClick={() => setStep(1)}>Back to Address</button>
                <button className="place-order-btn" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                  {isPlacingOrder ? "Processing..." : `Place Order • ${fmt(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="checkout-sidebar">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item: any) => (
                <div className="summary-item" key={item.id}>
                  <img src={item.img} alt={item.name} />
                  <div className="item-info">
                    <span className="name">{item.name}</span>
                    <span className="qty-price">Qty: {item.qty} × {fmt(getNumPrice(item.price))}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-calc">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="calc-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free" : ""}>{shipping === 0 ? "FREE" : fmt(shipping)}</span>
              </div>
              <div className="calc-divider" />
              <div className="calc-row total">
                <span>Total Amount</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="checkout-loading">Loading checkout...</div>}>
      <CheckoutFlowContent />
    </Suspense>
  );
}
