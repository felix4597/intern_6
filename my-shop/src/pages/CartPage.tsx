import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import type { Product } from "../data/products";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPageProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate(); // ✅ 결제 페이지 이동을 위한 훅

  // 수량 증가/감소 함수
  const changeQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.product.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter(item => item.quantity > 0) // 수량 0이면 삭제
    );
  };

  // 상품 삭제
  const handleRemove = (id: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  const handleGoToPayment = () => {
    navigate("/payment"); // ✅ 결제 페이지로 이동
  };

  if (cartItems.length === 0) {
    return <p className="mt-10 text-center">장바구니가 비어 있습니다.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <ul>
        {cartItems.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center justify-between mb-3">
            <div>
              <p>{product.name}</p>
              <p className="text-gray-600">{product.price.toLocaleString()}원</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeQuantity(product.id, -1)}
                className="px-2 py-1 bg-gray-300 rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => changeQuantity(product.id, 1)}
                className="px-2 py-1 bg-gray-300 rounded"
              >
                +
              </button>
              <button
                onClick={() => handleRemove(product.id)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ 결제하기 버튼 */}
      <button
        onClick={handleGoToPayment}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        결제하기
      </button>
    </div>
  );
};

export default CartPage;
