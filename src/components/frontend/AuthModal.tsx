"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiMail, FiLock, FiUser, FiArrowRight, FiPhone } from "react-icons/fi";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {

      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: cleaned });
    } else if (name === "name") {

      const cleaned = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: cleaned });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Full Email Validation check for both login and signup
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      toast.error("Email address is required");
      setLoading(false);
      return;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validation for Sign Up
    if (!isLogin) {
      if (!otpVerified) {
        toast.error("Please verify your email before signing up");
        setLoading(false);
        return;
      }
      if (formData.name.trim().length < 2) {
        toast.error("Please enter a valid name (min 2 characters)");
        setLoading(false);
        return;
      }
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(formData.name)) {
        toast.error("Name should only contain letters and spaces");
        setLoading(false);
        return;
      }
      if (formData.phone.length !== 10) {
        toast.error("Phone number must be exactly 10 digits");
        setLoading(false);
        return;
      }
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9");
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {

        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid email or password");
        } else {
          toast.success("Logged in successfully!");
          localStorage.setItem('isLoggedIn', 'true');
          window.dispatchEvent(new Event('authChange'));
          onClose();
          
          if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const callback = params.get("callback");
            if (callback) {
              window.location.href = callback;
            }
          }
        }
      } else {

        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Account created! Please sign in.");
          setIsLogin(true);
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter a valid email address");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "OTP sent to your email!");
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      toast.error("Please enter a 4-digit OTP");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Email verified successfully!");
        setOtpVerified(true);
      } else {
        toast.error("Enter the valid email");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <FiX size={22} />
        </button>

        <div className="auth-header">
          <span className="auth-logo-icon">⬡</span>
          <h2 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="auth-subtitle">
            {isLogin
              ? "Enter your credentials to access your account."
              : "Join SDPT Store to get the best deals on PC components."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <div className="auth-input-icon"><FiUser size={18} /></div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^a-zA-Z\s]/g, "");
                }}
                pattern="[a-zA-Z\s]*"
                title="Name should only contain letters and spaces"
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="auth-input-group">
              <div className="auth-input-icon"><FiPhone size={18} /></div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (10 digits)"
                value={formData.phone}
                onChange={handleChange}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\D/g, "").slice(0, 10);
                }}
                pattern="[0-9]*"
                maxLength={10}
                title="Phone number should only contain 10 digits"
                required
              />
            </div>
          )}

          <div className="auth-input-group" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div className="auth-input-icon"><FiMail size={18} /></div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                disabled={otpVerified && !isLogin}
                required
                style={otpVerified && !isLogin ? { backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#166534' } : {}}
              />
            </div>
            {!isLogin && !otpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !formData.email}
                style={{ padding: '0 15px', borderRadius: '8px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', minWidth: '95px' }}
              >
                {otpLoading ? "..." : (otpSent ? "Resend" : "Send OTP")}
              </button>
            )}
            {!isLogin && otpVerified && (
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px', background: '#dcfce7', color: '#16a34a', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                Verified
              </div>
            )}
          </div>

          {!isLogin && otpSent && !otpVerified && (
            <div className="auth-input-group" style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <div className="auth-input-icon" style={{ fontSize: '12px', fontWeight: '700', color: '#666' }}>OTP</div>
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  style={{ paddingLeft: '50px' }}
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpLoading || otp.length !== 4}
                style={{ padding: '0 15px', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', minWidth: '95px' }}
              >
                {otpLoading ? "..." : "Verify"}
              </button>
            </div>
          )}

          <div className="auth-input-group">
            <div className="auth-input-icon"><FiLock size={18} /></div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isLogin && (
            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")} <FiArrowRight />
          </button>
        </form>



        <div className="auth-footer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="auth-toggle-btn" onClick={toggleMode}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
