import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";

import type { Product } from "./data/products";
import { useCartStorage } from "./hooks/useCartStorage";

const App = () => {
  const { cartItems, setCartItems } = useCartStorage([]); // ✅ localStorage 연동

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.product.id === product.id);
      if (exist) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Header cartCount={cartCount} />
      <Routes>
        <Route
          path="/"
          element={<ProductListPage onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/products/:id"
          element={<ProductDetailPage onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
