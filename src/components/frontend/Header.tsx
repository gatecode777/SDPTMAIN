"use client";

import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX,
  FiChevronDown, FiMonitor, FiCpu, FiHardDrive, FiHeadphones,
  FiHome, FiGrid, FiArrowRight
} from "react-icons/fi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CartContext } from "@/CartContext";
import { WishlistContext } from "@/WishlistContext";
import { getCategories } from "@/actions/category";
import AuthModal from "./AuthModal";
import "./Header.css";
import Image from "next/image";
import logo from "@/assets/logo.png";

const offers = [
  "🔥 RTX 4060 Sale — Limited Stock Available",
  "🖥️ Build Your Dream PC — Free Consultation",
  "⚡ SSD + RAM Combo Deals — Save Up to 30%",
  "🎮 Gaming Peripherals — Starting ₹499",
];

interface Category {
  _id: string;
  name: string;
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offerIndex, setOfferIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);
  const businessTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  const handleMouseEnter = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    megaTimeout.current = setTimeout(() => {
      setMegaOpen(false);
    }, 150);
  };

  const closeMegaMenu = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(false);
  };

  const handleBusinessMouseEnter = () => {
    if (businessTimeout.current) clearTimeout(businessTimeout.current);
    setBusinessOpen(true);
  };

  const handleBusinessMouseLeave = () => {
    businessTimeout.current = setTimeout(() => {
      setBusinessOpen(false);
    }, 150);
  };

  const closeBusinessMenu = () => {
    if (businessTimeout.current) clearTimeout(businessTimeout.current);
    setBusinessOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    const handleAuthChange = () => setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    const handleOpenAuth = () => setAuthOpen(true);
    
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('openAuthModal', handleOpenAuth);
    
    // Fetch categories for the mega menu
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Header categories fetch failed", err);
      }
    };
    fetchCats();

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('openAuthModal', handleOpenAuth);
      if (megaTimeout.current) clearTimeout(megaTimeout.current);
      if (businessTimeout.current) clearTimeout(businessTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else if (status === "unauthenticated") {
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
    }
  }, [status]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setAuthOpen(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  const handleAccountClick = () => {
    if (isLoggedIn) {
      router.push('/account?tab=profile');
    } else {
      setAuthOpen(true);
    }
  };

  const { cart } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);
  const cartCount = cart.reduce((acc: number, item: any) => acc + item.qty, 0);

  useEffect(() => {
    const t = setInterval(() => {
      setOfferIndex((p) => (p + 1) % offers.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    let cachedTriggerHeight = 0;

    const calculateTriggerHeight = () => {
      if (pathname === "/") {
        const heroEl = (document.querySelector('.slider') || document.querySelector('.hero')) as HTMLElement;
        cachedTriggerHeight = heroEl ? heroEl.offsetHeight * 0.8 : window.innerHeight * 0.8;
      }
    };

    calculateTriggerHeight();
    window.addEventListener("resize", calculateTriggerHeight);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (pathname === "/") {
        setShowMobileBar(window.scrollY > cachedTriggerHeight);
      } else {
        setShowMobileBar(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateTriggerHeight);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
    setMegaOpen(false);
    setBusinessOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = "";
      }
    };
  }, [mobileMenuOpen]);

  const handleNav = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  const isActive = (path: string) => pathname === path;

  // Group categories for the mega menu
  const groupedCategories = useMemo(() => {
    const groups: Record<string, { title: string; icon: any; items: Category[] }> = {
      components: { title: "Components", icon: <FiCpu />, items: [] },
      storage: { title: "Storage", icon: <FiHardDrive />, items: [] },
      peripherals: { title: "Peripherals", icon: <FiHeadphones />, items: [] },
      monitors: { title: "Displays", icon: <FiMonitor />, items: [] },
    };

    categories.forEach(cat => {
      const name = cat.name.toLowerCase();
      if (name.includes("processor") || name.includes("cpu") || name.includes("graphics") || name.includes("gpu") || name.includes("card") || name.includes("board") || name.includes("ram") || name.includes("supply") || name.includes("case") || name.includes("cooler") || name.includes("fan")) {
        groups.components.items.push(cat);
      } else if (name.includes("ssd") || name.includes("hdd") || name.includes("storage") || name.includes("drive") || name.includes("memory")) {
        groups.storage.items.push(cat);
      } else if (name.includes("keyboard") || name.includes("mouse") || name.includes("headset") || name.includes("speaker") || name.includes("audio") || name.includes("accessory") || name.includes("input")) {
        groups.peripherals.items.push(cat);
      } else if (name.includes("monitor") || name.includes("display") || name.includes("screen") || name.includes("tv") || name.includes("output")) {
        groups.monitors.items.push(cat);
      } else {
        groups.components.items.push(cat); 
      }
    });

    return Object.values(groups).filter(g => g.items.length > 0);
  }, [categories]);

  return (
    <>
      <header className={`header ${scrolled ? "header--scrolled" : ""}`} suppressHydrationWarning>
        <div className="header-inner">
          <button aria-label="Toggle Menu" className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} suppressHydrationWarning>
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link href="/" className="logo">
            <Image src={logo} alt="SDTP Logo" className="logo-img" width={150} height={40} priority />
          </Link>

          <nav className="desktop-nav">
            <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
            <div 
              className="nav-link nav-link--has-mega"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/shop" className={`nav-link-inner ${isActive("/shop") ? "active" : ""}`} onClick={closeMegaMenu}>
                Products <FiChevronDown size={15} className={`nav-arrow ${megaOpen ? "rotated" : ""}`} />
              </Link>
              <div className={`mega-menu ${megaOpen ? "mega-menu--open" : ""}`}>
                <div className="mega-menu-inner">
                  {groupedCategories.map((group, idx) => (
                    <div className="mega-col" key={idx}>
                      <h4 className="mega-col-title">{group.icon} {group.title}</h4>
                      {group.items.map((cat) => (
                        <Link
                          href={`/shop?cat=${cat._id}`}
                          key={cat._id}
                          className="mega-col-link"
                          onClick={closeMegaMenu}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mega-footer">
                  <Link href="/shop" className="mega-footer-link" onClick={closeMegaMenu}>
                    View All Products <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
            
            <Link 
              href="/platform" 
              className={`nav-link ${isActive("/platform") ? "active" : ""}`}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setAuthOpen(true);
                }
              }}
            >
              Platform
            </Link>
            
            <div 
              className="nav-link nav-link--has-dropdown"
              onMouseEnter={handleBusinessMouseEnter}
              onMouseLeave={handleBusinessMouseLeave}
            >
              <Link href="/business" className={`nav-link-inner cursor-pointer ${pathname.startsWith("/business") ? "active" : ""}`} onClick={closeBusinessMenu}>
                Business <FiChevronDown size={15} className={`nav-arrow ${businessOpen ? "rotated" : ""}`} />
              </Link>
              <div className={`dropdown-menu ${businessOpen ? "dropdown-menu--open" : ""}`}>
                <Link href="/business/list" className="dropdown-link" onClick={closeBusinessMenu}>
                  List your business
                </Link>
                <Link href="/business/categories" className="dropdown-link" onClick={closeBusinessMenu}>
                  Categories
                </Link>
                <Link href="/business#how-it-works" className="dropdown-link" onClick={closeBusinessMenu}>
                  How it works
                </Link>
                <Link href="/business/pricing" className="dropdown-link" onClick={closeBusinessMenu}>
                  Pricing
                </Link>
                <Link href="/business#faq" className="dropdown-link" onClick={closeBusinessMenu}>
                  Help
                </Link>
              </div>
            </div>

            <Link href="/lenders" className={`nav-link ${isActive("/lenders") ? "active" : ""}`}>Lenders</Link>
            
            <Link href="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
            <Link href="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>
          </nav>

          <div className="header-icons">
            <button aria-label="Search" className="icon-btn desktop-only" onClick={() => setSearchOpen(true)} suppressHydrationWarning><FiSearch size={22} /></button>
            <button aria-label="User Account" className="icon-btn" onClick={handleAccountClick} suppressHydrationWarning><FiUser size={22} /></button>
            <button aria-label="Wishlist" className="icon-btn desktop-only" onClick={() => handleNav("/wishlist")} suppressHydrationWarning>
              <FiHeart size={22} />
              {mounted && wishlistCount > 0 && <span className="cart-badge wishlist-badge">{wishlistCount}</span>}
            </button>
            <button aria-label="Cart" className="icon-btn cart-btn" onClick={() => handleNav("/cart")} suppressHydrationWarning>
              <FiShoppingBag size={22} />
              {mounted && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        <div className="mobile-search-container">
          <form onSubmit={handleSearch} className="mobile-search-form">
            <FiSearch size={18} />
            <input type="text" placeholder="Search for products..." value={query} onChange={(e) => setQuery(e.target.value)} suppressHydrationWarning />
          </form>
        </div>
      </header>

      <div className={`mobile-overlay ${mobileMenuOpen ? "mobile-overlay--open" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`mobile-drawer ${mobileMenuOpen ? "mobile-drawer--open" : ""}`}>
        <div className="drawer-header">
          <span className="drawer-logo">
            <Image src={logo} alt="SDTP Logo" className="drawer-logo-img" width={120} height={32} priority />
          </span>
          <button aria-label="Close Menu" className="drawer-close" onClick={() => setMobileMenuOpen(false)} suppressHydrationWarning><FiX size={22} /></button>
        </div>
        <div className="drawer-search">
          <form onSubmit={handleSearch} className="drawer-search-form">
            <FiSearch size={16} />
            <input type="text" placeholder="Search CPU, GPU, RAM..." value={query} onChange={(e) => setQuery(e.target.value)} suppressHydrationWarning />
          </form>
        </div>
        <nav className="drawer-nav">
          <Link href="/" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <div className="drawer-link-group">
            <div className="drawer-link drawer-link--parent" onClick={() => setMobileSubmenu(mobileSubmenu === "products" ? null : "products")}>
              Products
              <FiChevronDown className={`drawer-arrow ${mobileSubmenu === "products" ? "rotated" : ""}`} />
            </div>
            <div className={`drawer-submenu ${mobileSubmenu === "products" ? "drawer-submenu--open" : ""}`}>
              {groupedCategories.map((group, idx) => (
                <div key={idx} className="drawer-submenu-group">
                  <span className="drawer-submenu-title">{group.title}</span>
                  {group.items.map((cat) => (
                    <Link
                      href={`/shop?cat=${cat._id}`}
                      key={cat._id}
                      className="drawer-submenu-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Link 
            href="/platform" 
            className="drawer-link" 
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (!isLoggedIn) {
                e.preventDefault();
                setAuthOpen(true);
              }
            }}
          >
            Platform
          </Link>

          <div className="drawer-link-group">
            <div className="drawer-link drawer-link--parent" onClick={() => setMobileSubmenu(mobileSubmenu === "business" ? null : "business")}>
              Business
              <FiChevronDown className={`drawer-arrow ${mobileSubmenu === "business" ? "rotated" : ""}`} />
            </div>
            <div className={`drawer-submenu ${mobileSubmenu === "business" ? "drawer-submenu--open" : ""}`}>
              <Link href="/business/list" className="drawer-submenu-link" onClick={() => setMobileMenuOpen(false)}>
                List your business
              </Link>
              <Link href="/business/categories" className="drawer-submenu-link" onClick={() => setMobileMenuOpen(false)}>
                Categories
              </Link>
              <Link href="/business#how-it-works" className="drawer-submenu-link" onClick={() => setMobileMenuOpen(false)}>
                How it works
              </Link>
              <Link href="/business/pricing" className="drawer-submenu-link" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/business#faq" className="drawer-submenu-link" onClick={() => setMobileMenuOpen(false)}>
                Help
              </Link>
            </div>
          </div>

          <Link href="/lenders" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Lenders</Link>

          <Link href="/about" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/contact" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </nav>
      </div>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <h3>Search Our Store</h3>
              <button aria-label="Close Search" className="search-close" onClick={() => setSearchOpen(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrap">
                <FiSearch size={18} />
                <input type="text" placeholder="Search for CPUs, GPUs, RAM, SSDs..." value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
              </div>
              <button type="submit" className="search-submit">Search</button>
            </form>
          </div>
        </div>
      )}

      <div className={`mobile-bar ${showMobileBar ? "visible" : ""}`}>
        <div className={`m-item ${isActive("/") ? "active" : ""}`} onClick={() => handleNav("/")}><FiHome size={18} /><span>Home</span></div>
        <div className={`m-item ${isActive("/shop") ? "active" : ""}`} onClick={() => handleNav("/shop")}><FiGrid size={18} /><span>Shop</span></div>
        <div className={`m-item ${isActive("/wishlist") ? "active" : ""}`} onClick={() => handleNav("/wishlist")}><FiHeart size={18} /><span>Wishlist</span></div>
        <div className={`m-item ${isActive("/cart") ? "active" : ""}`} onClick={() => handleNav("/cart")}>
          <FiShoppingBag size={18} /><span>Cart</span>
          {mounted && cartCount > 0 && <b className="m-badge">{cartCount}</b>}
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Header;
