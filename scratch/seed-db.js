const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn("Could not set DNS servers", e);
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables from .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env");
  process.exit(1);
}

// -------------------------------------------------------------
// SCHEMAS DEFINITION
// -------------------------------------------------------------

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    mobileNumber: { type: String },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "CUSTOMER"],
      default: "CUSTOMER",
    },
    isActive: { type: Boolean, default: true },
    cart: [],
    wishlist: [{ type: String }], 
    addresses: [{
      label: { type: String, default: "Home" },
      fullName: { type: String },
      phone: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      isDefault: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isVisible: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    sku: { type: String, required: true, unique: true },
    images: [{ type: String }],
    thumbnail: { type: String },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    offerPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    lowStockAlert: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "PUBLISHED",
    },
    isFeatured: { type: Boolean, default: false },
    isOnOffer: { type: Boolean, default: false },
    offerDescription: { type: String },
    warrantyDuration: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5 },
    totalReviews: { type: Number, default: 0 },
    ratings: [],
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        variant: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: { type: String, required: true }, 
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"],
      default: "PENDING",
    },
    paymentDetails: {
      transactionId: String,
      upiId: String,
      cardLast4: String,
      paymentTimestamp: Date,
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "RETURN_REQUESTED", "REFUNDED"],
      default: "PENDING",
    },
    returnDetails: {
      isReturnRequested: { type: Boolean, default: false },
      reason: String,
      requestDate: Date,
      status: {
        type: String,
        enum: ["NONE", "PENDING", "APPROVED", "REJECTED", "COMPLETED"],
        default: "NONE",
      },
      refundAmount: Number,
      returnDeadline: Date, 
    },
    refundDetails: {
      refundMethod: { type: String, enum: ["ORIGINAL", "UPI", "NONE"], default: "NONE" },
      upiId: String,
      refundStatus: { type: String, enum: ["PENDING", "COMPLETED", "NONE"], default: "NONE" },
    },
    trackingNumber: { type: String },
    deliveryDate: { type: Date },
    invoiceUrl: { type: String },
    history: [],
  },
  { timestamps: true }
);

const BannerSchema = new mongoose.Schema(
  {
    badge: { type: String, default: "Limited Time Offer" },
    title: { type: String, default: "Summer Gaming Upgrade Sale" },
    description: { type: String, default: "Get up to 40% off on RTX 40-series." },
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "/shop" },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80" },
    expiryDate: { type: Date, default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }, 
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
    value: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, 
    usedCount: { type: Number, default: 0 },
    minCartValue: { type: Number, default: 0 },
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const QuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "PENDING",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

const SettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "SDPT Store" },
    storeEmail: { type: String },
    storePhone: { type: String },
    address: { type: String },
    currency: { type: String, default: "USD" },
    taxPercentage: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    logo: { type: String },
    favicon: { type: String },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Models
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
const Query = mongoose.models.Query || mongoose.model("Query", QuerySchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

// Helper to generate dates back in time
function getPastDate(monthsAgo, daysAgo = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // Clear old data
    console.log("Clearing existing collections...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});
    await Query.deleteMany({});
    await Settings.deleteMany({});
    console.log("Collections cleared.");

    // 1. Seed Users (Admin + Customers with staggered creation dates for growth chart)
    console.log("Seeding users...");
    const adminPassword = await bcrypt.hash("admin@123", 10);
    const customerPassword = await bcrypt.hash("customer123", 10);

    const usersData = [
      {
        name: "Admin User",
        email: "admin@gmail.com",
        password: adminPassword,
        role: "SUPER_ADMIN",
        mobileNumber: "9876543210",
        createdAt: getPastDate(6)
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        mobileNumber: "9988776655",
        createdAt: getPastDate(5)
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        mobileNumber: "8877665544",
        createdAt: getPastDate(4)
      },
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        mobileNumber: "7766554433",
        createdAt: getPastDate(3)
      },
      {
        name: "Bob Brown",
        email: "bob@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        mobileNumber: "6655443322",
        createdAt: getPastDate(2)
      },
      {
        name: "Charlie Green",
        email: "charlie@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        mobileNumber: "5544332211",
        createdAt: getPastDate(1)
      },
      {
        name: "David Wright",
        email: "david@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        mobileNumber: "4433221100",
        createdAt: getPastDate(0, 2) // 2 days ago
      }
    ];

    const seededUsers = await User.insertMany(usersData);
    console.log(`Seeded ${seededUsers.length} users.`);

    const customers = seededUsers.filter(u => u.role === "CUSTOMER");

    // 2. Seed Categories
    console.log("Seeding categories...");
    const topLevels = [
      { name: "Computer Components", slug: "components", description: "Internal hardware like CPU, RAM, and Motherboards", isVisible: true },
      { name: "Storage Devices", slug: "storage", description: "Internal and external storage solutions", isVisible: true },
      { name: "Input Devices", slug: "input-devices", description: "Keyboards, mice, and other input hardware", isVisible: true },
      { name: "Output Devices", slug: "output-devices", description: "Monitors, printers, and speakers", isVisible: true },
    ];
    const seededCategories = await Category.insertMany(topLevels);
    console.log(`Seeded ${seededCategories.length} categories.`);

    const compCat = seededCategories.find(c => c.slug === "components");
    const storCat = seededCategories.find(c => c.slug === "storage");
    const inputCat = seededCategories.find(c => c.slug === "input-devices");
    const outputCat = seededCategories.find(c => c.slug === "output-devices");

    // 3. Seed Products
    console.log("Seeding products...");
    const productsData = [
      {
        name: "Intel Core i9-14900K",
        slug: "intel-i9-14900k",
        description: "14th Gen Intel Core desktop processor featuring 24 cores (8 P-cores + 16 E-cores).",
        shortDescription: "Intel flagship desktop CPU",
        category: compCat._id,
        sku: "CPU-INT-14900K",
        images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80"],
        thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
        mrp: 589,
        discountPercentage: 10,
        offerPrice: 530,
        price: 530,
        stockQuantity: 25,
        status: "PUBLISHED",
        isFeatured: true
      },
      {
        name: "AMD Ryzen 7 7800X3D",
        slug: "amd-ryzen-7800x3d",
        description: "8-core, 16-thread desktop processor with 3D V-Cache technology, ultimate for gaming.",
        shortDescription: "Best gaming processor on the market",
        category: compCat._id,
        sku: "CPU-AMD-7800X3D",
        images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80"],
        thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
        mrp: 449,
        discountPercentage: 12,
        offerPrice: 395,
        price: 395,
        stockQuantity: 40,
        status: "PUBLISHED",
        isFeatured: true
      },
      {
        name: "Samsung 990 PRO 2TB NVMe",
        slug: "samsung-990-pro-2tb",
        description: "PCIe Gen4 NVMe M.2 internal solid state drive with up to 7450 MB/s read speeds.",
        shortDescription: "Ultra-fast high-end NVMe SSD",
        category: storCat._id,
        sku: "SSD-SAM-990P2T",
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
        thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
        mrp: 180,
        discountPercentage: 15,
        offerPrice: 153,
        price: 153,
        stockQuantity: 15,
        status: "PUBLISHED",
        isFeatured: false
      },
      {
        name: "Logitech G Pro X Superlight 2",
        slug: "logitech-g-pro-superlight-2",
        description: "Wireless gaming mouse with Lightforce hybrid switches, Hero 2 sensor, ultra-lightweight design.",
        shortDescription: "Professional wireless gaming mouse",
        category: inputCat._id,
        sku: "MSE-LOG-GPROSL2",
        images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80"],
        thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&q=80",
        mrp: 159,
        discountPercentage: 5,
        offerPrice: 151,
        price: 151,
        stockQuantity: 8, // triggers low stock alert
        status: "PUBLISHED",
        isFeatured: true
      },
      {
        name: "ASUS ROG Swift 27\" 1440p OLED",
        slug: "asus-rog-swift-27-oled",
        description: "OLED gaming monitor with 240Hz refresh rate, 0.03ms response time, G-Sync compatible.",
        shortDescription: "Premium 27-inch OLED gaming monitor",
        category: outputCat._id,
        sku: "MON-ASU-ROG27OL",
        images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80"],
        thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80",
        mrp: 899,
        discountPercentage: 20,
        offerPrice: 719,
        price: 719,
        stockQuantity: 12,
        status: "PUBLISHED",
        isFeatured: true
      }
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProducts.length} products.`);

    const pI9 = seededProducts.find(p => p.slug === "intel-i9-14900k");
    const pRyzen = seededProducts.find(p => p.slug === "amd-ryzen-7800x3d");
    const pSSD = seededProducts.find(p => p.slug === "samsung-990-pro-2tb");
    const pMouse = seededProducts.find(p => p.slug === "logitech-g-pro-superlight-2");
    const pMonitor = seededProducts.find(p => p.slug === "asus-rog-swift-27-oled");

    // 4. Seed Orders (Distributed across past 6 months to generate rich analytics graphs)
    console.log("Seeding orders...");
    const ordersData = [
      {
        orderId: "ORD-0001",
        customer: customers[0]._id, // John
        items: [
          { product: pI9._id, name: pI9.name, quantity: 1, price: pI9.offerPrice }
        ],
        totalAmount: pI9.offerPrice,
        shippingAddress: { fullName: "John Doe", city: "New York", state: "NY", postalCode: "10001", country: "USA", phone: "9988776655" },
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(5)
      },
      {
        orderId: "ORD-0002",
        customer: customers[1]._id, // Jane
        items: [
          { product: pSSD._id, name: pSSD.name, quantity: 2, price: pSSD.offerPrice }
        ],
        totalAmount: pSSD.offerPrice * 2,
        shippingAddress: { fullName: "Jane Smith", city: "Los Angeles", state: "CA", postalCode: "90001", country: "USA", phone: "8877665544" },
        paymentMethod: "UPI",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(4)
      },
      {
        orderId: "ORD-0003",
        customer: customers[2]._id, // Alice
        items: [
          { product: pMouse._id, name: pMouse.name, quantity: 1, price: pMouse.offerPrice },
          { product: pSSD._id, name: pSSD.name, quantity: 1, price: pSSD.offerPrice }
        ],
        totalAmount: pMouse.offerPrice + pSSD.offerPrice,
        shippingAddress: { fullName: "Alice Johnson", city: "Chicago", state: "IL", postalCode: "60601", country: "USA", phone: "7766554433" },
        paymentMethod: "UPI",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(3)
      },
      {
        orderId: "ORD-0004",
        customer: customers[3]._id, // Bob
        items: [
          { product: pMonitor._id, name: pMonitor.name, quantity: 1, price: pMonitor.offerPrice }
        ],
        totalAmount: pMonitor.offerPrice,
        shippingAddress: { fullName: "Bob Brown", city: "Houston", state: "TX", postalCode: "77001", country: "USA", phone: "6655443322" },
        paymentMethod: "COD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(2)
      },
      {
        orderId: "ORD-0005",
        customer: customers[4]._id, // Charlie
        items: [
          { product: pRyzen._id, name: pRyzen.name, quantity: 1, price: pRyzen.offerPrice },
          { product: pMouse._id, name: pMouse.name, quantity: 2, price: pMouse.offerPrice }
        ],
        totalAmount: pRyzen.offerPrice + pMouse.offerPrice * 2,
        shippingAddress: { fullName: "Charlie Green", city: "Phoenix", state: "AZ", postalCode: "85001", country: "USA", phone: "5544332211" },
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(1)
      },
      // Last 7 days orders (to populate the "Sales by Day" chart)
      {
        orderId: "ORD-0006",
        customer: customers[5]._id, // David
        items: [
          { product: pI9._id, name: pI9.name, quantity: 1, price: pI9.offerPrice }
        ],
        totalAmount: pI9.offerPrice,
        shippingAddress: { fullName: "David Wright", city: "Philadelphia", state: "PA", postalCode: "19101", country: "USA", phone: "4433221100" },
        paymentMethod: "UPI",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(0, 4) // 4 days ago
      },
      {
        orderId: "ORD-0007",
        customer: customers[0]._id, // John
        items: [
          { product: pSSD._id, name: pSSD.name, quantity: 1, price: pSSD.offerPrice },
          { product: pMouse._id, name: pMouse.name, quantity: 1, price: pMouse.offerPrice }
        ],
        totalAmount: pSSD.offerPrice + pMouse.offerPrice,
        shippingAddress: { fullName: "John Doe", city: "New York", state: "NY", postalCode: "10001", country: "USA", phone: "9988776655" },
        paymentMethod: "UPI",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(0, 2) // 2 days ago
      },
      {
        orderId: "ORD-0008",
        customer: customers[1]._id, // Jane
        items: [
          { product: pMonitor._id, name: pMonitor.name, quantity: 1, price: pMonitor.offerPrice }
        ],
        totalAmount: pMonitor.offerPrice,
        shippingAddress: { fullName: "Jane Smith", city: "Los Angeles", state: "CA", postalCode: "90001", country: "USA", phone: "8877665544" },
        paymentMethod: "CREDIT_CARD",
        paymentStatus: "COMPLETED",
        orderStatus: "DELIVERED",
        createdAt: getPastDate(0, 1) // 1 day ago
      },
      {
        orderId: "ORD-0009",
        customer: customers[2]._id, // Alice
        items: [
          { product: pRyzen._id, name: pRyzen.name, quantity: 1, price: pRyzen.offerPrice }
        ],
        totalAmount: pRyzen.offerPrice,
        shippingAddress: { fullName: "Alice Johnson", city: "Chicago", state: "IL", postalCode: "60601", country: "USA", phone: "7766554433" },
        paymentMethod: "UPI",
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        createdAt: getPastDate(0, 0) // today
      }
    ];

    const seededOrders = await Order.insertMany(ordersData);
    console.log(`Seeded ${seededOrders.length} orders.`);

    // 5. Seed Banners
    console.log("Seeding banners...");
    const bannersData = [
      {
        badge: "Hot Deal",
        title: "Upgrade to OLED",
        description: "Enjoy up to 20% off on ASUS ROG OLED monitors. Vivid colors and 240Hz refresh rates.",
        buttonText: "View Monitors",
        buttonLink: "/category/output-devices",
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        isActive: true
      },
      {
        badge: "Special Event",
        title: "Ryzen Gaming Special",
        description: "Equip your build with AMD Ryzen 3D V-Cache processors for ultimate performance.",
        buttonText: "Shop CPUs",
        buttonLink: "/category/components",
        imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
        isActive: true
      }
    ];
    const seededBanners = await Banner.insertMany(bannersData);
    console.log(`Seeded ${seededBanners.length} banners.`);

    // 6. Seed Coupons
    console.log("Seeding coupons...");
    const couponsData = [
      {
        code: "WELCOME10",
        type: "PERCENTAGE",
        value: 10,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 100,
        minCartValue: 50,
        isActive: true
      },
      {
        code: "SUPER50",
        type: "FIXED",
        value: 50,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        usageLimit: 50,
        minCartValue: 200,
        isActive: true
      },
      {
        code: "EXPIRED20",
        type: "PERCENTAGE",
        value: 20,
        expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // expired
        usageLimit: 10,
        minCartValue: 100,
        isActive: false
      }
    ];
    const seededCoupons = await Coupon.insertMany(couponsData);
    console.log(`Seeded ${seededCoupons.length} coupons.`);

    // 7. Seed Queries
    console.log("Seeding customer queries...");
    const queriesData = [
      {
        name: "Emily Watson",
        email: "emily@example.com",
        phone: "1231231234",
        subject: "Warranty verification",
        message: "Hi, I purchased the Intel i9 CPU. How can I verify the 3-year warranty status with the manufacturer?",
        status: "PENDING",
      },
      {
        name: "Mark Ruffalo",
        email: "mark@example.com",
        phone: "3213214321",
        subject: "Bulk ordering discount",
        message: "Hello, we are setting up a local computer lab and want to purchase 15 units of Samsung NVMe SSDs. Is there a bulk discount?",
        status: "IN_PROGRESS",
        adminNotes: "Contacted Mark. Checking stock limits."
      },
      {
        name: "Scarlett Johansson",
        email: "scarlett@example.com",
        phone: "5551234567",
        subject: "Order cancellation request",
        message: "I made a mistake in shipping address for ORD-0002. Can you please cancel or modify it?",
        status: "RESOLVED",
        adminNotes: "Resolved. Modified the shipping details."
      }
    ];
    const seededQueries = await Query.insertMany(queriesData);
    console.log(`Seeded ${seededQueries.length} queries.`);

    // 8. Seed Settings
    console.log("Seeding store settings...");
    const seededSettings = await Settings.create({
      storeName: "SDPT Premium Hardware",
      storeEmail: "support@sdpt.com",
      storePhone: "+1-800-555-SDPT",
      address: "100 Tech Blvd, Silicon Valley, CA, USA",
      currency: "USD",
      taxPercentage: 8,
      shippingFee: 15,
      logo: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop",
      favicon: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=32&h=32&fit=crop",
      socialLinks: {
        facebook: "https://facebook.com/sdpt",
        instagram: "https://instagram.com/sdpt",
        twitter: "https://twitter.com/sdpt",
      },
      maintenanceMode: false
    });
    console.log(`Seeded store settings: ${seededSettings.storeName}.`);

    console.log("\n==========================================");
    console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==========================================");

  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
