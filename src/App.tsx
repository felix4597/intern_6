import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";

const App = () => (
  <BrowserRouter>
    <Header cartCount={0} />
    <Routes>
      <Route path="/" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
