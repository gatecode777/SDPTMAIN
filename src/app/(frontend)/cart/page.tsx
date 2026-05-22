"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiShield, FiTruck, FiTag, FiCheck, FiX } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import Swal from "sweetalert2";
import { getCoupons } from "@/actions/coupon";
import { useSession } from "next-auth/react";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQty, clearCart } = useContext(CartContext);
  const [promo, setPromo] = useState("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const promoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (promoRef.current && !promoRef.current.contains(event.target as Node)) {
        setShowCoupons(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNumPrice = (p: any) => typeof p === 'string' ? parseInt(p.replace(/[^\d]/g, ''), 10) : p;
  const fmt = (n: any) => "₹" + Number(n).toLocaleString("en-IN");
  
  const subtotal = cart.reduce((a: number, i: any) => a + (getNumPrice(i.price) * i.qty), 0);
  
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "PERCENTAGE") {
      discountAmount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === "FIXED") {
      discountAmount = appliedCoupon.value;
    }
  }
  
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shipping = totalAfterDiscount > 5000 ? 0 : 499;
  const total = totalAfterDiscount + shipping;

  useEffect(() => {
    const fetchCoupons = async () => {
      const res = await getCoupons();
      if (res.success) {
        
        const active = res.coupons.filter((c: any) => {
          if (!c.isActive) return false;
          if (new Date(c.expiryDate) < new Date()) return false;
          return true;
        });
        setCoupons(active);
      }
    };
    fetchCoupons();
  }, []);

  const handleApplyPromo = (code: string = promo) => {
    if (!code) {
      Swal.fire({ title: "Error", text: "Please enter a promo code", icon: "error", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
      return;
    }

    const foundCoupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!foundCoupon) {
      Swal.fire({ title: "Invalid Code", text: "This promo code is invalid or expired.", icon: "error", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
      return;
    }

    if (subtotal < foundCoupon.minCartValue) {
      Swal.fire({ 
        title: "Minimum Value Not Met", 
        text: `This coupon requires a minimum cart value of ${fmt(foundCoupon.minCartValue)}.`, 
        icon: "warning", 
        toast: true, 
        position: "top-end", 
        timer: 3000, 
        showConfirmButton: false 
      });
      return;
    }

    setAppliedCoupon(foundCoupon);
    setPromo(foundCoupon.code);
    setShowCoupons(false);
    Swal.fire({ title: "Coupon Applied!", text: `You saved ${foundCoupon.type === 'PERCENTAGE' ? foundCoupon.value + '%' : fmt(foundCoupon.value)}.`, icon: "success", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromo("");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-inner">
          <div className="cart-empty-icon"><FiShoppingBag size={48} /></div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products yet. Browse our catalog and find something you love!</p>
          <Link href="/shop" className="cart-shop-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handleRemove = (id: any, name: string) => {
    Swal.fire({
      title: "Remove Item?",
      text: `Are you sure you want to remove ${name} from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove it"
    }).then((res) => {
      if (res.isConfirmed) {
        removeFromCart(id);
        Swal.fire({
          title: "Removed!",
          text: "Item has been removed from cart.",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-header-inner">
          <Link href="/shop" className="cart-back"><FiArrowLeft size={16} /> Continue Shopping</Link>
          <h1>Shopping Cart <span>({cart.length} {cart.length === 1 ? "item" : "items"})</span></h1>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item: any) => (
            <div className="cart-item" key={item.id}>
              <div className="ci-img">
                <img src={item.img || "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80"} alt={item.name} />
              </div>
              <div className="ci-body">
                <div className="ci-top">
                  <div>
                    <span className="ci-cat">{item.category}</span>
                    <Link href={`/product/${item.id}`} className="ci-name">{item.name}</Link>
                  </div>
                  <button className="ci-remove" onClick={() => handleRemove(item.id, item.name)} aria-label="Remove">
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="ci-bottom">
                  <div className="ci-qty">
                    <button
                      className="ci-qty-btn"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      <FiMinus size={13} />
                    </button>
                    <span>{item.qty}</span>
                    <button className="ci-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>
                      <FiPlus size={13} />
                    </button>
                  </div>
                  <span className="ci-price">{fmt(getNumPrice(item.price) * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="summary-row" style={{ color: '#10b981' }}>
                <span>Discount ({appliedCoupon.code})</span>
                <span>-{fmt(discountAmount)}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? "free-ship" : ""}>{shipping === 0 ? "FREE" : fmt(shipping)}</span>
            </div>
            {shipping > 0 && (
              <div className="summary-note">
                Add {fmt(5000 - totalAfterDiscount)} more for free shipping
              </div>
            )}
            
            <div ref={promoRef} className="summary-promo" style={{ position: 'relative' }}>
              <div className="promo-input">
                <FiTag size={16} />
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  value={promo} 
                  onChange={(e) => setPromo(e.target.value)}
                  onFocus={() => coupons.length > 0 && !appliedCoupon && setShowCoupons(true)}
                  disabled={appliedCoupon !== null}
                />
                {appliedCoupon ? (
                  <button onClick={handleRemoveCoupon} style={{ background: '#ef4444', color: 'white' }}>
                    <FiX size={16} />
                  </button>
                ) : (
                  <button onClick={() => handleApplyPromo()}>Apply</button>
                )}
              </div>
              
              {showCoupons && !appliedCoupon && (
                <div className="promo-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  marginTop: '-4px'
                }}>
                  {coupons.length > 0 ? (
                    coupons.map(c => (
                      <div 
                        key={c._id} 
                        className="promo-option"
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onClick={() => handleApplyPromo(c.code)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>
                          <strong style={{ display: 'block', color: '#0f172a', marginBottom: '2px' }}>{c.code}</strong>
                          <small style={{ color: '#64748b' }}>
                            {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                            {c.minCartValue > 0 && ` (Min. ${fmt(c.minCartValue)})`}
                          </small>
                        </div>
                        <FiCheck size={16} color="#0ea5e9" />
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                      No available coupons
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="summary-divider" />
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              const isLoggedIn = status === "authenticated";
              if (isLoggedIn) {
                router.push('/checkout');
              } else {
                window.dispatchEvent(new Event('openAuthModal'));
                Swal.fire({
                  title: "Login Required",
                  text: "Please sign in to proceed with your order.",
                  icon: "info",
                  toast: true,
                  position: "top-end",
                  timer: 3000,
                  showConfirmButton: false
                });
              }
            }} 
            className="checkout-btn" 
            style={{ display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none', border: 'none', cursor: 'pointer' }}
          >
            Proceed to Checkout
          </button>

          <div className="summary-trust">
            <div className="st-item"><FiShield size={14} /> Secure Checkout</div>
            <div className="st-item"><FiTruck size={14} /> Free shipping over ₹5,000</div>
          </div>

          <div className="summary-payment">
            <span>Accepted payments</span>
            <div className="pay-icons">
              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
              <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
              <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" />
              <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;

