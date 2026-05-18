import React from "react";

interface ShopBreadcrumbProps {
  searchQ?: string | null;
}

const ShopBreadcrumb: React.FC<ShopBreadcrumbProps> = ({ searchQ }) => {
  return (
    <div className="shop-breadcrumb">
      <div className="shop-breadcrumb-inner">
        {searchQ && <><span>/</span><span>"{searchQ}"</span></>}
      </div>
      <h1 className="shop-page-title">
        {searchQ ? `Results for "${searchQ}"` : "All Products"}
      </h1>
    </div>
  );
};

export default ShopBreadcrumb;
