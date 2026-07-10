"use client";

import React, { useContext, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FiUser, FiBook, FiBox, FiSettings, FiLogOut, FiCamera, FiEdit2, FiPhone, FiMail, FiLock, FiTruck, FiGlobe } from "react-icons/fi";
import { CartContext } from "@/CartContext";
import "./Checkout.css";
import Swal from 'sweetalert2';

import { useSession, signOut } from "next-auth/react";
import { getUserData, addUserAddress, deleteUserAddress, updateAddress, updateUserProfile } from "@/actions/user-sync";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { compressImage } from "@/lib/image";

const AccountContent = () => {
  const { cart } = useContext(CartContext);
  const { data: session, status, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "profile");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [dbProfile, setDbProfile] = useState({ name: "", mobileNumber: "", image: "" });
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  const user = session?.user;
  const [newName, setNewName] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "authenticated") {
        const res = await getUserData();
        if (res.success) {
          setAddresses(res.addresses || []);
          const nameToSet = res.name || session?.user?.name || "";
          const mobileToSet = res.mobileNumber || "";
          const imageToSet = res.image || "";
          
          setMobileNumber(mobileToSet);
          setProfileImage(imageToSet);
          setNewName(nameToSet);
          setDbProfile({ name: nameToSet, mobileNumber: mobileToSet, image: imageToSet });
          setCreatedAt(res.createdAt || null);
        }
        
        // Fetch Orders
        const { getUserOrders } = await import("@/actions/order");
        const ordersRes = await getUserOrders();
        if (ordersRes.success) {
          setOrders(ordersRes.orders || []);
        }
      }
    };
    fetchUserData();
  }, [status]);

  const handleLogout = async () => {
    localStorage.removeItem('isLoggedIn');
    window.dispatchEvent(new Event('authChange'));
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleAddAddress = async () => {
    const { value: formValues } = await Swal.fire({
      title: '<span style="font-family:Poppins,sans-serif;font-weight:700;font-size:22px;color:#0f172a">Add New Address</span>',
      html: `
        <div style="display:flex;flex-direction:column;gap:14px;padding:8px 0;text-align:left">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Label</label>
            <input id="swal-label" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;transition:border 0.2s;background:#f8fafc" placeholder="e.g. Home, Office" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Full Name</label>
            <input id="swal-fullname" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="Recipient's full name" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'" oninput="this.value = this.value.replace(/[^a-zA-Z\\s]/g, '')">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Phone Number</label>
            <input id="swal-phone" type="tel" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="+91 98765 43210" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'" oninput="this.value = this.value.replace(/\\D/g, '').slice(0, 10)">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Street Address</label>
            <input id="swal-street" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="House no, Street, Locality" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">City</label>
              <input id="swal-city" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="City" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">State</label>
              <input id="swal-state" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="State" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
            </div>
          </div>
          <div style="max-width:50%">
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Zip Code</label>
            <input id="swal-zip" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="PIN Code" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '💾 Save Address',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#94a3b8',
      width: '520px',
      customClass: {
        popup: 'swal-address-popup',
      },
      preConfirm: () => {
        const fullName = (document.getElementById('swal-fullname') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;
        const street = (document.getElementById('swal-street') as HTMLInputElement).value;
        const city = (document.getElementById('swal-city') as HTMLInputElement).value;
        if (!fullName || !street || !city) {
          Swal.showValidationMessage('Please fill in Name, Street and City');
          return false;
        }
        return {
          label: (document.getElementById('swal-label') as HTMLInputElement).value || 'Home',
          fullName,
          phone,
          street,
          city,
          state: (document.getElementById('swal-state') as HTMLInputElement).value,
          zipCode: (document.getElementById('swal-zip') as HTMLInputElement).value,
        }
      }
    });

    if (formValues) {
      const res = await addUserAddress(formValues);
      if (res.success) {
        setAddresses(res.addresses);
        toast.success("Address added successfully!");
      } else {
        toast.error("Failed to add address");
      }
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await deleteUserAddress(id);
      if (res.success) {
        setAddresses(res.addresses);
        toast.success("Address deleted");
      } else {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleEditAddress = async (addr: any) => {
    const { value: formValues } = await Swal.fire({
      title: '<span style="font-family:Poppins,sans-serif;font-weight:700;font-size:22px;color:#0f172a">Edit Address</span>',
      html: `
        <div style="display:flex;flex-direction:column;gap:14px;padding:8px 0;text-align:left">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Label</label>
            <input id="swal-label" value="${addr.label || ''}" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="e.g. Home, Office" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Full Name</label>
            <input id="swal-fullname" value="${addr.fullName || ''}" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="Recipient's full name" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'" oninput="this.value = this.value.replace(/[^a-zA-Z\\s]/g, '')">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Phone Number</label>
            <input id="swal-phone" type="tel" value="${addr.phone || ''}" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="+91 98765 43210" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'" oninput="this.value = this.value.replace(/\\D/g, '').slice(0, 10)">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Street Address</label>
            <input id="swal-street" value="${addr.street || ''}" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="House no, Street, Locality" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">City</label>
              <input id="swal-city" value="${addr.city || ''}" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="City" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">State</label>
              <input id="swal-state" value="${addr.state || ''}" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="State" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
            </div>
          </div>
          <div style="max-width:50%">
            <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px">Zip Code</label>
            <input id="swal-zip" value="${addr.zipCode || ''}" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;background:#f8fafc" placeholder="PIN Code" onfocus="this.style.borderColor='#0ea5e9'" onblur="this.style.borderColor='#e2e8f0'">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✏️ Update Address',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#94a3b8',
      width: '520px',
      preConfirm: () => {
        const fullName = (document.getElementById('swal-fullname') as HTMLInputElement).value;
        const phone = (document.getElementById('swal-phone') as HTMLInputElement).value;
        const street = (document.getElementById('swal-street') as HTMLInputElement).value;
        const city = (document.getElementById('swal-city') as HTMLInputElement).value;
        if (!fullName || !street || !city) {
          Swal.showValidationMessage('Please fill in Name, Street and City');
          return false;
        }
        return {
          label: (document.getElementById('swal-label') as HTMLInputElement).value || 'Home',
          fullName,
          phone,
          street,
          city,
          state: (document.getElementById('swal-state') as HTMLInputElement).value,
          zipCode: (document.getElementById('swal-zip') as HTMLInputElement).value,
        }
      }
    });

    if (formValues) {
      const res = await updateAddress(addr._id, formValues);
      if (res.success) {
        setAddresses(res.addresses);
        toast.success("Address updated successfully!");
      } else {
        toast.error("Failed to update address");
      }
    }
  };

  const getNumPrice = (p: any) => typeof p === 'string' ? parseInt(p.replace(/[^\d]/g, ''), 10) : p;
  const fmt = (n: any) => "₹" + Number(n).toLocaleString("en-IN");

  const today = new Date().toLocaleDateString('en-GB');

  const setActiveTabWithParam = (tab: string) => {
    setActiveTab(tab);
    router.push(`/account?tab=${tab}`);
  };



  useEffect(() => {
    if (user?.name && !newName) setNewName(user.name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await updateUserProfile({
        name: newName,
        mobileNumber: mobileNumber,
        image: profileImage,
      });

      if (res.success) {
        await update({ name: newName, mobileNumber: mobileNumber, image: profileImage });
        setDbProfile({ name: newName, mobileNumber: mobileNumber, image: profileImage });
        toast.success("Profile updated successfully!");
        setIsEditingProfile(false);
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new) {
      toast.error("Please fill all password fields");
      return;
    }
    setIsUpdating(true);
    try {
      const res = await updateUserProfile({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });

      if (res.success) {
        toast.success("Password changed successfully!");
        setPasswords({ current: "", new: "" });
      } else {
        toast.error(res.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRateProduct = async (item: any) => {
    const { value: formValues } = await Swal.fire({
      title: `Rate ${item.name}`,
      html: `
        <div style="margin-bottom: 15px; text-align: left;">
          <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: #334155;">Rating (1 to 5 Stars)</label>
          <select id="swal-rating" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; outline: none;">
            <option value="5">★★★★★ - 5 Stars (Excellent)</option>
            <option value="4">★★★★☆ - 4 Stars (Good)</option>
            <option value="3">★★★☆☆ - 3 Stars (Average)</option>
            <option value="2">★★☆☆☆ - 2 Stars (Fair)</option>
            <option value="1">★☆☆☆☆ - 1 Star (Poor)</option>
          </select>
        </div>
        <div style="margin-bottom: 15px; text-align: left;">
          <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: #334155;">Write a Review (Optional)</label>
          <textarea id="swal-review" rows="3" placeholder="Share your experience with this product..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; outline: none;"></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit Rating",
      confirmButtonColor: "#00b4d8",
      preConfirm: () => {
        const rating = (document.getElementById('swal-rating') as HTMLSelectElement).value;
        const review = (document.getElementById('swal-review') as HTMLTextAreaElement).value;
        return { rating: Number(rating), review };
      }
    });

    if (formValues) {
      const productId = typeof item.product === 'object' ? item.product._id : item.product;
      const { rateProduct } = await import("@/actions/product");
      const res = await rateProduct(productId, formValues.rating, formValues.review, session?.user?.email || "anonymous");
      if (res.success) {
        toast.success("Thank you for your rating!");
      } else {
        toast.error(res.error || "Failed to submit rating");
      }
    }
  };

  const handleReturnRequest = async (order: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Return Request',
      html: `
        <div style="text-align: left; display: flex; flex-direction: column; gap: 15px;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 5px;">Reason for Return</label>
            <textarea id="return-reason" class="swal2-textarea" style="margin: 0; width: 100%;" placeholder="Describe why you are returning this item..."></textarea>
          </div>
          ${(order.paymentStatus === 'COMPLETED' || (order.paymentMethod && order.paymentMethod !== 'COD')) ? `
          <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; border: 1px solid #bae6fd;">
            <label style="display: block; font-weight: 700; margin-bottom: 10px; color: #0369a1;">Refund Preference</label>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <select id="refund-method" class="swal2-select" style="margin: 0; width: 100%; border: 1.5px solid #0ea5e9;" onchange="document.getElementById('upi-input-wrapper').style.display = this.value === 'UPI' ? 'block' : 'none'">
                <option value="ORIGINAL">Back to Original Payment Method</option>
                <option value="UPI">Refund to UPI ID</option>
              </select>
              <div id="upi-input-wrapper" style="display: none;">
                <label style="display: block; font-weight: 600; margin-bottom: 5px; font-size: 14px;">UPI ID</label>
                <input id="refund-upi" class="swal2-input" style="margin: 0; width: 100%;" placeholder="username@upi">
              </div>
            </div>
          </div>
          ` : ''}
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      confirmButtonText: 'Submit Request',
      preConfirm: () => {
        const reason = (document.getElementById('return-reason') as HTMLTextAreaElement).value;
        if (!reason) {
          Swal.showValidationMessage('Please provide a reason');
          return false;
        }
        const refundMethod = (document.getElementById('refund-method') as HTMLSelectElement)?.value || 'NONE';
        const upiId = (document.getElementById('refund-upi') as HTMLInputElement)?.value;
        if (refundMethod === 'UPI' && !upiId) {
          Swal.showValidationMessage('Please provide a UPI ID');
          return false;
        }
        return { reason, refundMethod, upiId };
      }
    });

    if (formValues) {
      const { requestReturn } = await import("@/actions/order");
      const res = await requestReturn(order._id, formValues.reason, {
        refundMethod: formValues.refundMethod,
        upiId: formValues.upiId
      });
      if (res.success) {
        toast.success("Return request submitted successfully");
        const { getUserOrders } = await import("@/actions/order");
        const ordersRes = await getUserOrders();
        if (ordersRes.success) {
          setOrders(ordersRes.orders || []);
        }
      } else {
        toast.error(res.message || "Failed to submit return request");
      }
    }
  };

  const handleCancelOrder = async (order: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Cancel Order',
      html: `
        <div style="text-align: left; display: flex; flex-direction: column; gap: 15px;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 5px;">Reason for Cancellation</label>
            <textarea id="cancel-reason" class="swal2-textarea" style="margin: 0; width: 100%;" placeholder="Tell us why you want to cancel..."></textarea>
          </div>
          ${(order.paymentStatus === 'COMPLETED' || (order.paymentMethod && order.paymentMethod !== 'COD')) ? `
          <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; border: 1px solid #bae6fd;">
            <label style="display: block; font-weight: 700; margin-bottom: 10px; color: #0369a1;">Refund Preference (Prepaid Order)</label>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <select id="refund-method-cancel" class="swal2-select" style="margin: 0; width: 100%; border: 1.5px solid #0ea5e9;" onchange="document.getElementById('upi-input-wrapper-cancel').style.display = this.value === 'UPI' ? 'block' : 'none'">
                <option value="ORIGINAL">Back to Original Payment Method</option>
                <option value="UPI">Refund to UPI ID</option>
              </select>
              <div id="upi-input-wrapper-cancel" style="display: none;">
                <label style="display: block; font-weight: 600; margin-bottom: 5px; font-size: 14px;">UPI ID</label>
                <input id="refund-upi-cancel" class="swal2-input" style="margin: 0; width: 100%;" placeholder="username@upi">
              </div>
            </div>
          </div>
          ` : ''}
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Cancel Order',
      preConfirm: () => {
        const reason = (document.getElementById('cancel-reason') as HTMLTextAreaElement).value;
        if (!reason) {
          Swal.showValidationMessage('Please provide a reason');
          return false;
        }
        const refundMethod = (document.getElementById('refund-method-cancel') as HTMLSelectElement)?.value || 'NONE';
        const upiId = (document.getElementById('refund-upi-cancel') as HTMLInputElement)?.value;
        if (refundMethod === 'UPI' && !upiId) {
          Swal.showValidationMessage('Please provide a UPI ID');
          return false;
        }
        return { reason, refundMethod, upiId };
      }
    });

    if (formValues) {
      const { cancelOrder } = await import("@/actions/order");
      const res = await cancelOrder(order._id, formValues.reason, {
        refundMethod: formValues.refundMethod,
        upiId: formValues.upiId
      });
      if (res.success) {
        toast.success("Order cancelled successfully");
        const { getUserOrders } = await import("@/actions/order");
        const ordersRes = await getUserOrders();
        if (ordersRes.success) {
          setOrders(ordersRes.orders || []);
        }
      } else {
        toast.error(res.message || "Failed to cancel order");
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      case 'SHIPPED': return '#3b82f6';
      case 'PROCESSING': return '#f59e0b';
      case 'CONFIRMED': return '#8b5cf6';
      case 'REFUNDED': return '#3b82f6';
      case 'RETURNED': return '#64748b';
      default: return '#64748b';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <main className="co-main profile-redesign">
            <div className="co-header">
              <div>
                <h1 className="co-title">My Profile</h1>
                <p className="co-subtitle">View and manage your account information</p>
              </div>
              {!isEditingProfile && (
                <button className="co-action-btn" onClick={() => setIsEditingProfile(true)}>
                  <FiEdit2 size={16} style={{ marginRight: '8px' }} /> Edit Profile
                </button>
              )}
            </div>

            <div className="profile-card-container">
              <div className="profile-card-header">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-main">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">
                        <FiUser size={48} />
                      </div>
                    )}
                    {isEditingProfile && (
                      <label className="avatar-upload-label" title="Change Profile Picture">
                        <FiCamera size={20} />
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                      </label>
                    )}
                  </div>
                  <div className="profile-header-info">
                    <span className="user-role-badge">
                      Member Since {createdAt ? new Date(createdAt).getFullYear() : 2024}
                    </span>
                    <h3>{newName || user?.name || "User Account"}</h3>
                    <p className="profile-email-sub">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="profile-card-body">
                <div className="profile-section-header">
                  <h4>Account Information</h4>
                  <p>Basic details about your account identity</p>
                </div>
                <form className="profile-edit-form" onSubmit={handleUpdateProfile}>
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <label className="info-label"><FiUser size={14} /> Full Name</label>
                      <input 
                        type="text" 
                        className={`info-input ${!isEditingProfile ? 'read-only' : ''}`}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          target.value = target.value.replace(/[^a-zA-Z\s]/g, "");
                        }}
                        placeholder="Enter full name"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                    
                    <div className="profile-info-item">
                      <label className="info-label"><FiMail size={14} /> Email Address</label>
                      <input 
                        type="email" 
                        className="info-input read-only"
                        value={user?.email || ""}
                        placeholder="Email address"
                        readOnly
                      />
                      <span className="field-hint">Email cannot be changed after registration</span>
                    </div>

                    <div className="profile-info-item">
                      <label className="info-label"><FiPhone size={14} /> Mobile Number</label>
                      <input 
                        type="tel" 
                        className={`info-input ${!isEditingProfile ? 'read-only' : ''}`}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          target.value = target.value.replace(/\D/g, "").slice(0, 10);
                        }}
                        placeholder="Add mobile number"
                        readOnly={!isEditingProfile}
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="profile-form-actions">
                      <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={() => {
                          setIsEditingProfile(false);
                          setNewName(dbProfile.name);
                          setMobileNumber(dbProfile.mobileNumber);
                          setProfileImage(dbProfile.image);
                        }}
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="save-btn"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </main>
        );
      case "orders":
        return (
          <main className="co-main">
            <div className="co-header">
              <div>
                <h1 className="co-title">My Orders</h1>
                <p className="co-subtitle">View and track your previous orders</p>
              </div>
              <div style={{ padding: '10px 15px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '13px', color: '#0369a1' }}>
                <strong>Policy:</strong> 7-day easy returns after delivery. Orders can be cancelled anytime before they are shipped.
              </div>
            </div>
            <div className="co-orders-list">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div className="co-summary-box" key={order._id} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '15px' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '16px', color: '#0f172a' }}>Order #{order.orderId}</strong>
                        <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>Placed on {format(new Date(order.createdAt), "dd/MM/yyyy")}</span>
                        {order.deliveryDate && (
                          <span style={{ fontSize: '13px', color: order.orderStatus === 'DELIVERED' ? '#10b981' : '#3b82f6', display: 'block', fontWeight: 500, marginTop: '2px' }}>
                            {order.orderStatus === 'DELIVERED' ? 'Delivered on' : 'Expected Delivery'}: {format(new Date(order.deliveryDate), "dd/MM/yyyy")}
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          display: 'inline-block', 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: 600,
                          backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                          color: getStatusColor(order.orderStatus)
                        }}>
                          {order.orderStatus}
                        </span>
                        <div style={{ marginTop: '5px', fontWeight: 600, color: '#0f172a' }}>{fmt(order.totalAmount)}</div>
                      </div>
                    </div>
                    
                    <div className="co-order-items">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ 
                            width: '40px', height: '40px', 
                            backgroundColor: '#f1f5f9', 
                            borderRadius: '6px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginRight: '15px'
                          }}>
                            <FiBox size={16} color="#64748b" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>{item.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity} × {fmt(item.price)}</div>
                              {order.orderStatus === 'DELIVERED' && (
                                <button
                                  type="button"
                                  onClick={() => handleRateProduct(item)}
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#d97706',
                                    backgroundColor: '#fef3c7',
                                    border: '1px solid #fde68a',
                                    padding: '3px 10px',
                                    borderRadius: '100px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  ★ Rate Product
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {order.trackingNumber && (
                      <div style={{ marginTop: '15px', padding: '10px 15px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiTruck size={14} color="#3b82f6" />
                        <span style={{ color: '#475569' }}>Tracking Number: <strong>{order.trackingNumber}</strong></span>
                      </div>
                    )}

                    {}
                    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      {['PENDING', 'CONFIRMED', 'PACKED'].includes(order.orderStatus) && (
                        <button 
                          className="co-link-btn" 
                          style={{ color: '#ef4444', fontWeight: 600, border: '1px solid #fecaca', padding: '5px 12px', borderRadius: '6px' }}
                          onClick={() => handleCancelOrder(order)}
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.orderStatus === 'DELIVERED' && !order.returnDetails?.isReturnRequested && (() => {
                        const delivery = new Date(order.deliveryDate || order.updatedAt);
                        const diff = Math.ceil(Math.abs(new Date().getTime() - delivery.getTime()) / (1000 * 60 * 60 * 24));
                        if (diff <= 7) {
                          return (
                            <button 
                              className="co-link-btn" 
                              style={{ color: '#0ea5e9', fontWeight: 600, border: '1px solid #bae6fd', padding: '5px 12px', borderRadius: '6px' }}
                              onClick={() => handleReturnRequest(order)}
                            >
                              Request Return (7 Days Left)
                            </button>
                          );
                        }
                        return null;
                      })()}

                      {order.returnDetails?.isReturnRequested && (
                        <div style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: 600 }}>
                          Return Requested: {order.returnDetails.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="co-summary-box" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <FiBox size={48} color="#cbd5e1" style={{ margin: '0 auto 15px' }} />
                  <h3 style={{ fontSize: '18px', color: '#334155', marginBottom: '10px' }}>No orders yet</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>When you place orders, they will appear here so you can track them.</p>
                  <Link href="/shop" className="co-action-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>Start Shopping</Link>
                </div>
              )}
            </div>
          </main>
        );
      case "address":
        return (
          <main className="co-main">
            <div className="co-header">
              <div>
                <h1 className="co-title">Address Book</h1>
                <p className="co-subtitle">Manage your shipping and billing addresses</p>
              </div>
              <button className="co-action-btn" onClick={handleAddAddress}>Add New</button>
            </div>
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <div className="co-summary-box co-item-card" key={addr._id} style={{ marginBottom: '20px' }}>
                  <div className="cs-group" style={{ marginBottom: 0 }}>
                    <span className="cs-label">
                      {addr.label} {addr.isDefault && <span className="co-badge">Default</span>}
                    </span>
                    <p className="cs-value" style={{ fontWeight: 600 }}>{addr.fullName}</p>
                    {addr.phone && <p className="cs-value" style={{ color: '#64748b', fontSize: '13px' }}>📞 {addr.phone}</p>}
                    <p className="cs-value">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                    <div className="co-card-actions">
                      <button className="co-link-btn" onClick={() => handleEditAddress(addr)}>Edit</button>
                      <button className="co-link-btn text-red" onClick={() => handleDeleteAddress(addr._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="co-summary-box">
                <p className="co-empty">No addresses found. Add one to get started!</p>
              </div>
            )}
          </main>
        );
      case "settings":
        return (
          <main className="co-main">
            <div className="co-header">
              <div>
                <h1 className="co-title">Account Settings</h1>
                <p className="co-subtitle">Manage your account preferences and security</p>
              </div>
            </div>
            <form className="co-summary-box" onSubmit={handleUpdatePassword}>
              <div className="co-section-title" style={{ marginBottom: '20px', fontSize: '18px' }}>Security & Password</div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                We recommend using a strong password that you don't use elsewhere.
              </p>
              
              <div className="cs-group">
                <span className="cs-label">Current Password</span>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                  <input 
                    type="password" 
                    className="co-input" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    placeholder="Enter current password" 
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
              <div className="cs-group">
                <span className="cs-label">New Password</span>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                  <input 
                    type="password" 
                    className="co-input" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    placeholder="Minimum 6 characters" 
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '30px' }}>
                <button type="submit" className="co-action-btn" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          </main>
        );
      default:
        return (
          <main className="co-main">
            <div className="co-header">
              <div>
                <h1 className="co-title">My Profile</h1>
                <p className="co-subtitle">Manage your personal information</p>
              </div>
            </div>
            <div className="co-summary-box">
              <div className="cs-group">
                <span className="cs-label">Full Name</span>
                <input 
                  type="text" 
                  className="co-input" 
                  defaultValue={newName || user?.name || ""} 
                  placeholder="Enter your full name" 
                  autoComplete="name" 
                  readOnly
                />
              </div>
              <div className="cs-group">
                <span className="cs-label">Email Address</span>
                <input 
                  type="email" 
                  className="co-input" 
                  defaultValue={user?.email || ""} 
                  placeholder="Enter your email" 
                  autoComplete="email" 
                  readOnly 
                />
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="co-page">
      <div className="co-banner">
        <div className="co-banner-content">
          <h1>Account Dashboard</h1>
          <p>Manage your profile, active orders, and settings.</p>
        </div>
      </div>
      <div className="co-container">
        <aside className="co-sidebar">
          <nav className="co-nav">
            <button className={`co-nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTabWithParam('profile')}><FiUser size={18} /> My Account</button>
            <Link href="/dashboard" className="co-nav-link">
              <FiGlobe size={18} /> AI Workspace
            </Link>
            <button className={`co-nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTabWithParam('orders')}><FiBox size={18} /> My Orders</button>
            <button className={`co-nav-link ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTabWithParam('address')}><FiBook size={18} /> Address Book</button>
            <button className={`co-nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTabWithParam('settings')}><FiSettings size={18} /> Settings</button>
          </nav>
          <button className="co-logout-btn" onClick={handleLogout}><FiLogOut size={18} /> Logout</button>
        </aside>

        {renderContent()}

      </div>
    </div>
  );
};

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
