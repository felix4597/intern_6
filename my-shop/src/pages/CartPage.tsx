import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, type CartItem } from "../types";

interface CartPageProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// === 배송비 정책(필요시 변경) ===
const FREE_SHIPPING_THRESHOLD = 50000; // 5만원 이상 무료
const SHIPPING_FLAT_FEE = 3000;        // 기본 3천원

const CartPage: React.FC<CartPageProps> = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  // 선택 삭제용 선택 상태
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const isAllSelected =
    cartItems.length > 0 && selectedIds.size === cartItems.length;

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      if (cartItems.length === 0) return new Set();
      if (prev.size === cartItems.length) return new Set(); // 모두 선택 → 모두 해제
      return new Set(cartItems.map(({ product }) => product.id));
    });
  }, [cartItems]);

  // 수량 증가/감소(최소 1 보장)
  const changeQuantity = useCallback(
    (id: number, delta: number) => {
      setCartItems(prev =>
        prev
          .map(item =>
            item.product.id === id
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          )
          .filter(item => item.quantity > 0)
      );
    },
    [setCartItems]
  );

  // 수량 직접 입력
  const inputQuantity = useCallback(
    (id: number, value: string) => {
      const n = Number(value.replace(/\D/g, "")); // 숫자만
      const next = Number.isFinite(n) && n > 0 ? Math.min(n, 9999) : 1;
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === id ? { ...item, quantity: next } : item
        )
      );
    },
    [setCartItems]
  );

  // 개별 삭제(확인)
  const handleRemove = useCallback(
    (id: number) => {
      const ok = window.confirm("해당 상품을 장바구니에서 삭제할까요?");
      if (!ok) return;
      setCartItems(prev => prev.filter(item => item.product.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [setCartItems]
  );

  // 선택 삭제
  const handleRemoveSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    const ok = window.confirm("선택한 상품을 장바구니에서 삭제할까요?");
    if (!ok) return;
    setCartItems(prev => prev.filter(item => !selectedIds.has(item.product.id)));
    setSelectedIds(new Set());
  }, [selectedIds, setCartItems]);

  // 총액/배송비/최종금액
  const totalProducts = useMemo(
    () =>
      cartItems.reduce(
        (sum, { product, quantity }) =>
          sum + (product.price ?? 0) * quantity,
        0
      ),
    [cartItems]
  );

  const shippingFee = useMemo(() => {
    if (totalProducts === 0) return 0;
    return totalProducts >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_FEE;
  }, [totalProducts]);

  const finalTotal = totalProducts + shippingFee;

  // 결제 이동: 선택된 항목 있으면 선택만, 없으면 전체
  const handleGoToPayment = useCallback(() => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
    const itemsToPay =
      selectedIds.size > 0
        ? cartItems.filter(ci => selectedIds.has(ci.product.id))
        : cartItems;

    if (itemsToPay.length === 0) {
      alert("결제할 상품을 선택해주세요.");
      return;
    }

    // 주의: state 방식은 새로고침 시 소실될 수 있습니다(전역 상태 권장).
    navigate("/payment", { state: { cartItems: itemsToPay } });
  }, [cartItems, selectedIds, navigate]);

  // 빈 장바구니
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 mt-24 text-center">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          ← 뒤로가기
        </button>
        <div className="rounded-2xl border p-10">
          <h1 className="text-2xl font-bold mb-2">장바구니가 비어 있습니다</h1>
          <p className="text-gray-600 mb-6">
            담아두신 상품이 없어요. 마음에 드는 상품을 담아보세요!
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            상품 보러가기
          </button>
        </div>
      </div>
    );
  }

  // 결제 버튼 활성 조건(선택이 있으면 선택 기준, 없으면 전체 기준)
  const hasPayTarget =
    selectedIds.size > 0
      ? cartItems.some(ci => selectedIds.has(ci.product.id))
      : cartItems.length > 0;

  return (
    <div className="mx-auto max-w-5xl mt-20 px-4 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
      {/* 상단: 뒤로가기 & 선택 제어 */}
      <div className="md:col-span-2 -mt-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          ← 뒤로가기
        </button>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              aria-label="전체 선택"
            />
            전체 선택
          </label>
          <button
            onClick={handleRemoveSelected}
            disabled={selectedIds.size === 0}
            className={`px-3 py-2 rounded-lg border ${
              selectedIds.size === 0
                ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                : "text-red-600 border-red-200 hover:bg-red-50"
            }`}
          >
            선택 삭제
          </button>
        </div>
      </div>

      {/* 좌측: 장바구니 목록 */}
      <section>
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <ul className="space-y-3">
          {cartItems.map(({ product, quantity }) => {
            const unit = product.price ?? 0;
            const lineTotal = unit * quantity;
            const image = (product as any)?.image as string | undefined;
            const options = (product as any)?.options as
              | Record<string, string>
              | string
              | undefined;

            return (
              <li
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-2xl border p-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* 체크박스 */}
                  <input
                    type="checkbox"
                    aria-label={`${product.name} 선택`}
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelect(product.id)}
                  />

                  {/* 썸네일 */}
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 border grid place-items-center text-xs text-gray-500">
                      No Img
                    </div>
                  )}

                  {/* 정보 */}
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    {/* 옵션(있을 때만) */}
                    {options && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {typeof options === "string"
                          ? options
                          : Object.entries(options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      단가 {formatCurrency(unit)}원
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatCurrency(unit)}원 × {quantity} ={" "}
                      <strong>{formatCurrency(lineTotal)}원</strong>
                    </p>
                  </div>
                </div>

                {/* 조작 */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    aria-label="수량 감소"
                    onClick={() => changeQuantity(product.id, -1)}
                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    –
                  </button>

                  <input
                    aria-label="수량 입력"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-14 text-center border rounded-lg py-2"
                    value={String(quantity)}
                    onChange={(e) => inputQuantity(product.id, e.target.value)}
                  />

                  <button
                    aria-label="수량 증가"
                    onClick={() => changeQuantity(product.id, 1)}
                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemove(product.id)}
                    className="ml-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 우측: 결제 요약(Sticky) */}
      <aside className="md:sticky md:top-24 h-max rounded-2xl border p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">결제 정보</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">총 상품 금액</span>
            <strong>{formatCurrency(totalProducts)}원</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">배송비</span>
            <strong>
              {shippingFee === 0 ? (
                <span className="text-emerald-600">무료</span>
              ) : (
                `${formatCurrency(shippingFee)}원`
              )}
            </strong>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-base">
            <span className="font-semibold">최종 결제 금액</span>
            <strong className="text-lg">
              {formatCurrency(finalTotal)}원
            </strong>
          </div>
          {totalProducts < FREE_SHIPPING_THRESHOLD && totalProducts > 0 && (
            <p className="text-xs text-gray-500">
              {formatCurrency(FREE_SHIPPING_THRESHOLD - totalProducts)}원 추가
              구매 시 무료배송
            </p>
          )}
        </div>

        <button
          onClick={handleGoToPayment}
          disabled={!hasPayTarget}
          className={`mt-4 w-full py-3 rounded-xl text-white ${
            hasPayTarget
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          결제하기
        </button>
      </aside>
    </div>
  );
};

export default CartPage;
