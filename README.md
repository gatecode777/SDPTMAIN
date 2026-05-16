


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

