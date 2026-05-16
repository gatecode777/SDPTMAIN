import React from "react";

const categories = ["All", "CPU", "GPU", "Motherboard", "RAM", "Storage", "Monitor", "Mouse", "Keyboard", "Case", "PSU"];
const brands = ["All Brands", "NVIDIA", "AMD", "Intel", "ASUS", "Corsair", "Samsung", "LG", "Razer", "SteelSeries", "EVGA"];

interface ShopSidebarProps {
  selectedCat: string;
  setSelectedCat: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  allProducts: any[];
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({ 
  selectedCat, 
  setSelectedCat, 
  selectedBrand, 
  setSelectedBrand, 
  priceRange, 
  setPriceRange, 
  filterOpen, 
  setFilterOpen, 
  allProducts 
}) => {
  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  const resetFilters = () => {
    setSelectedCat("All");
    setSelectedBrand("All Brands");
    setPriceRange([0, 200000]);
  };

  return (
    <>
      <aside className={`shop-sidebar ${filterOpen ? "shop-sidebar--open" : ""}`}>
        <div className="sidebar-head">
          <h3>Filters</h3>
          <button className="sidebar-close" onClick={() => setFilterOpen(false)}>✕</button>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-label">Category</h4>
          {categories.map((c) => (
            <label key={c} className={`sidebar-check ${selectedCat === c ? "sidebar-check--on" : ""}`}>
              <input type="radio" name="cat" checked={selectedCat === c} onChange={() => setSelectedCat(c)} />
              {c}
              <span className="sidebar-count">
                {c === "All" ? allProducts.length : allProducts.filter((p) => p.category === c).length}
              </span>
            </label>
          ))}
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-label">Brand</h4>
          {brands.map((b) => (
            <label key={b} className={`sidebar-check ${selectedBrand === b ? "sidebar-check--on" : ""}`}>
              <input type="radio" name="brand" checked={selectedBrand === b} onChange={() => setSelectedBrand(b)} />
              {b}
            </label>
          ))}
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-label">Price Range</h4>
          <div className="price-labels">
            <span>{fmt(priceRange[0])}</span>
            <span>{fmt(priceRange[1])}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="price-slider"
          />
        </div>

        <button className="sidebar-reset" onClick={resetFilters}>Reset Filters</button>
      </aside>

      {filterOpen && <div className="sidebar-overlay" onClick={() => setFilterOpen(false)} />}
    </>
  );
};

export default ShopSidebar;
