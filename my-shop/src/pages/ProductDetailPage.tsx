import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";
import type { Product } from "../data/products";

interface ProductDetailPageProps {
  onAddToCart: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id); // id가 string일 수 있으니 숫자로 변환
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="mt-20 text-center text-red-500 font-semibold">
        상품을 찾을 수 없습니다. (ID: {id})
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p
        className="mt-2 text-gray-700"
        style={{ whiteSpace: "normal", wordBreak: "break-word", minHeight: "3rem" }}>{product.description}</p>
      <p className="mt-2 font-semibold">{product.price.toLocaleString()}원</p>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        장바구니에 담기
      </button>
    </div>
  );
};

export default ProductDetailPage;