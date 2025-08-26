import React from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import type { Product } from "../data/products";

interface ProductDetailPageProps {
  onAddToCart: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
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
      <p className="mt-1 text-xs text-gray-500">{product.brand}</p>
      <p className="mt-2 text-gray-700" style={{ whiteSpace: "normal", wordBreak: "break-word", minHeight: "3rem" }}>
        {product.description}
      </p>
      <p className="mt-2 font-semibold">{product.price.toLocaleString()}원</p>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        장바구니에 담기
      </button>

      {/* 동일 브랜드 관련 상품 */}
      {product.brand && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">같은 브랜드의 관련 상품</h2>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {products
              .filter((p) => p.brand === product.brand && p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.id}`}
                    className="block p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="text-sm text-gray-500">{p.brand}</div>
                    <div className="font-medium">{p.name}</div>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
