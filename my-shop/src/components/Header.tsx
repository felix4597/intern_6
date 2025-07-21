import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => (
  <header className="w-full p-4 bg-white shadow fixed top-0 left-0 z-10 flex justify-between items-center">
    <h1 className="text-lg font-bold">My Shop</h1>
    <div className="relative">
      <Link
        to="/cart"
        className="material-icons relative text-3xl text-gray-700 hover:text-gray-900"
      >
        shopping_cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  </header>
);

export default Header;