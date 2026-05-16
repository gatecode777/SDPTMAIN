# 🛒 SDTP - Premium E-Commerce & Admin Platform

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-PostCSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Auth.js](https://img.shields.io/badge/Auth.js-v5_Beta-violet?style=for-the-badge&logo=nextauth)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Components-000?style=for-the-badge&logo=shadcnui)

A fully-featured, production-ready E-Commerce Storefront and Administrative Management Panel built with **Next.js 16 (App Router)**, **TypeScript**, **MongoDB**, **Auth.js (NextAuth v5)**, and **Shadcn UI**. Designed with a premium aesthetic, robust state synchronization, and comprehensive administrative controls.

---

## ✨ Key Features

### 🛍️ Storefront Experience
- **Dynamic Product Catalog & Filtering**: Real-time multi-category navigation, search, price-range sliders, and instant grid/list view toggles.
- **Secure Authentication & OTP Verification**: Role-based authentication (Admin / User) powered by Auth.js with automated OTP verification and local development fallback modes.
- **Advanced Checkout Flow**: Support for Cash on Delivery (COD), UPI (with instant ID validation), and Credit/Debit Cards.
- **User Dashboard & Order Lifecycle**: Complete customer profile management, address book persistence, and real-time order tracking.
- **7-Day Easy Returns & Refund Preferences**: Automated return eligibility tracking with original payment or direct UPI refund preferences.
- **Real-Time Product Ratings**: Customers can instantly submit 1-5 star ratings and reviews for delivered products, reflecting immediately across the catalog.

### 🛡️ Administrative Control Panel
- **Executive Metrics Dashboard**: Live statistical breakdown of total revenue, active orders, customer acquisition, and inventory alerts.
- **Comprehensive Order & Refund Management**: Dedicated administrative workflows for tracking shipments, approving 7-day return requests, verifying customer UPI IDs, and processing refunds.
- **Dynamic Customer Query Management**: Centralized support ticketing system allowing admins to track incoming contact form submissions, update resolution statuses (`Pending`, `In Progress`, `Resolved`), and append internal resolution notes.
- **Inventory & Category Engine**: Full CRUD capabilities for products, dynamic categories, promotional banners, and discount coupons.
- **Premium Dark/Light Admin UI**: Built with Shadcn UI components, Lucide icons, and responsive sidebar navigation.

---

## 🏗️ Tech Stack & Architecture

- **Framework**: Next.js 16.2 (App Router & Turbopack)
- **Language**: TypeScript 5.x
- **Database & ORM**: MongoDB with Mongoose 9.x
- **Authentication**: Auth.js (NextAuth v5 Beta) with bcryptjs password hashing
- **Styling & UI**: Vanilla CSS + Tailwind CSS + Shadcn UI + Framer Motion + SweetAlert2
- **State Management**: Zustand + React Context API (Cart & Wishlist Providers)
- **Media Storage**: Cloudinary Integration
- **Email Delivery**: Nodemailer / SMTP Service

---

## 📂 Project Structure

```bash
├── src/
│   ├── actions/          # Next.js Server Actions (Products, Orders, Queries, Auth, User Sync)
│   ├── app/
│   │   ├── (frontend)/   # Public Storefront Pages (Shop, Cart, Checkout, Account, Contact)
│   │   ├── admin/        # Protected Admin Panel (Dashboard, Orders, Products, Queries, Coupons)
│   │   ├── api/          # API Routes & Auth.js Handlers
│   │   └── layout.tsx    # Root Layout & Global Font Configuration
│   ├── components/
│   │   ├── frontend/     # Storefront UI (Headers, Footers, Product Grids, Modals, Sliders)
│   │   ├── layout/       # Admin UI Navigation (Sidebar, Navbar, Metrics Cards)
│   │   ├── ui/           # Shadcn UI Primitives (Buttons, Dialogs, Tables, Badges, Select)
│   │   └── Providers.tsx # Client-Side Context Wrappers (Session, Cart, Wishlist, Toasters)
│   ├── models/           # Mongoose Database Schemas (User, Product, Order, Category, Query)
│   └── lib/              # Utility Helpers (Mongoose Connection, Classname Merging)
├── public/               # Static Assets & Placeholder Imagery
├── .env.example          # Environment Variable Configuration Template
├── .gitignore            # Git Exclusion Rules
├── package.json          # Dependency Manifest & Scripts
└── README.md             # Project Documentation
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/sdtp-ecommerce-admin.git
cd sdtp-ecommerce-admin
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Configuration
Copy the `.env.example` file to `.env` and fill in your corresponding credentials:
```bash
cp .env.example .env
```
Ensure your `MONGODB_URI`, `NEXTAUTH_SECRET`, and `AUTH_SECRET` are correctly configured.

### 4️⃣ Run the Development Server
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).
- **Public Storefront**: `http://localhost:3000/`
- **Admin Management Panel**: `http://localhost:3000/admin`

---

## 📜 License

This project is proprietary and built for high-performance e-commerce operations. All rights reserved.
