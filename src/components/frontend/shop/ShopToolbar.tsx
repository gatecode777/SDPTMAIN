import React from "react";
import { FiFilter, FiGrid, FiList } from "react-icons/fi";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated", "Newest"];

interface ShopToolbarProps {
  count: number;
  sort: string;
  setSort: (sort: string) => void;
  view: string;
  setView: (view: string) => void;
  setFilterOpen: (open: boolean) => void;
}

const ShopToolbar: React.FC<ShopToolbarProps> = ({ count, sort, setSort, view, setView, setFilterOpen }) => {
  return (
    <div className="shop-toolbar">
      <div className="toolbar-left">
        <button className="filter-toggle" onClick={() => setFilterOpen(true)}>
          <FiFilter size={15} /> Filters
        </button>
        <span className="toolbar-count">{count} products found</span>
      </div>
      <div className="toolbar-right">
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          {sortOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className={`view-btn ${view === "grid" ? "view-btn--on" : ""}`} onClick={() => setView("grid")}>
          <FiGrid size={16} />
        </button>
        <button className={`view-btn ${view === "list" ? "view-btn--on" : ""}`} onClick={() => setView("list")}>
          <FiList size={16} />
        </button>
      </div>
    </div>
  );
};

export default ShopToolbar;
