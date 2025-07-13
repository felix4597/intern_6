import React, { useState } from "react";
import { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (!added) {
      onAddToCart();
      setAdded(true);
    }
  };

  return (
    <div className="border rounded-xl p-3 shadow hover:shadow-md transition bg-white">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-36 object-cover rounded"
      />
      <h2 className="text-sm font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-700">{product.price.toLocaleString()}원</p>
      <button
        onClick={handleClick}
        className={\`mt-2 w-full py-1 rounded \${added
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"}\`}
        disabled={added}
      >
        {added ? "담김" : "담기"}
      </button>
    </div>
  );
};

export default ProductCard;