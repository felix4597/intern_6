import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => (
  <header className="w-full p-4 bg-white shadow fixed top-0 left-0 z-10 flex justify-between items-center">
    <Link to="/" className="text-lg font-bold hover:opacity-90">My Shop</Link>
    <nav className="flex items-center gap-4">
      <Link to="/products" className="text-sm text-gray-700 hover:underline">상품목록</Link>
      <div className="relative">
        <Link
          to="/cart"
          className="material-icons relative text-3xl text-gray-700 hover:text-gray-900"
          aria-label="장바구니"
        >
          shopping_cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  </header>
);

export default Header;
