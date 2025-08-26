import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products, type Product } from "../data/products";

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}
interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

const ORDER_KEY = "last_order";

const PaymentSuccessPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDER_KEY);
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  // 주문 정보가 없으면 자동으로 메인으로 이동 (UX 선택사항)
  useEffect(() => {
    if (!order) {
      const t = setTimeout(() => {
        try {
          window.location.href = "/";
        } catch {}
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [order]);

  const firstBrand = useMemo(() => {
    if (!order) return "";
    const firstProduct = products.find((p) => p.id === order.items[0]?.productId);
    return firstProduct?.brand || "";
  }, [order]);

  const related = useMemo(() => {
    if (!firstBrand) return [];
    return products.filter((p) => p.brand === firstBrand).slice(0, 6);
  }, [firstBrand]);

  if (!order) {
    return (
      <main className="max-w-screen-md mx-auto p-6 mt-20">
        <h1 className="text-2xl font-bold">주문 내역이 없습니다</h1>
        <p className="mt-2 text-gray-600">최근 결제 완료 정보가 없어 메인으로 이동해주세요.</p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg">메인으로</Link>
      </main>
    );
  }

  return (
    <main className="max-w-screen-md mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold">결제가 완료되었습니다 🎉</h1>
      <p className="mt-2 text-gray-600">
        주문번호 <span className="font-mono">{order.id}</span> / 주문일시 {new Date(order.createdAt).toLocaleString()}
      </p>

      <section className="mt-6 border rounded-xl p-4">
        <h2 className="font-semibold">주문 상품</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((it, idx) => {
            const p = products.find((pp) => pp.id === it.productId) as Product | undefined;
            return (
              <li key={idx} className="flex justify-between text-sm">
                <span>{p?.brand ? `[${p.brand}] ` : ""}{p?.name || `상품#${it.productId}`} × {it.quantity}</span>
                <span>{(it.price * it.quantity).toLocaleString()}원</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 pt-3 border-t flex justify-between font-semibold">
          <span>결제 금액</span>
          <span>{order.total.toLocaleString()}원</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">예상 배송일: 영업일 기준 2~3일</div>
      </section>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold">같은 브랜드 추천 상품</h2>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {related.map((p) => (
              <li key={p.id}>
                <Link to={`/products/${p.id}`} className="block p-3 rounded-lg border hover:bg-gray-50">
                  <div className="text-sm text-gray-500">{p.brand}</div>
                  <div className="font-medium">{p.name}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex gap-3">
        <Link to="/" className="px-4 py-2 rounded-lg border">메인으로</Link>
        <Link to="/products" className="px-4 py-2 rounded-lg bg-blue-600 text-white">계속 쇼핑하기</Link>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;
