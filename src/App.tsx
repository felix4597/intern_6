import React, { useState } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";

const App: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header cartCount={cartCount} />
      <ProductList onAddToCart={handleAddToCart} />
    </div>
  );
};

export default App;