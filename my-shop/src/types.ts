// src/types.ts
import type { Product } from "./data/products";

export interface CartItem {
  product: Product;
  quantity: number; // 원 단위 정수
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ko-KR").format(Math.trunc(value));
