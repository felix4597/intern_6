import React from "react";

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => (
  <header className="w-full p-4 bg-white shadow fixed top-0 left-10 z-10 flex justify-between items-center">
    <h4 className="text-lg font-bold">응용소프트웨어 샵</h4>
    <div className="relative">
      <span className="material-icons">shopping_cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </div>
  </header>
);

export default Header;