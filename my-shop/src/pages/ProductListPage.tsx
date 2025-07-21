import React from "react";
import type { Product } from "../data/products";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

interface ProductListPageProps {
  onAddToCart: (product: Product) => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ onAddToCart }) => {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mt-20 max-w-screen-md mx-auto">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </main>
  );
};

export default ProductListPage;