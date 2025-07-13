import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";

interface ProductListProps {
  onAddToCart: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  return (
    <main className="grid grid-cols-2 gap-4 p-4 mt-20">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </main>
  );
};

export default ProductList;