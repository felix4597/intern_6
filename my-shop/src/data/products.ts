export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  options?: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "상품 A",
    price: 32000,
    imageUrl: "/images/product1.png",
    description: "상품 A는 고급 원단으로 제작된 프리미엄 제품입니다.",
  },
  {
    id: 2,
    name: "상품 B",
    price: 25900,
    imageUrl: "/images/product2.png",
    description: "상품 B는 일상용으로 적합한 실속형 제품입니다.",
  },
  {
    id: 3,
    name: "상품 C",
    price: 21000,
    imageUrl: "/images/product3.png",
    description: "상품 C는 친환경 소재를 사용한 제품입니다.",
  },
  {
    id: 4,
    name: "상품 D",
    price: 15000,
    imageUrl: "/images/product4.png",
    description: "상품 D는 휴대성과 편의성을 강조한 제품입니다.",
  },
];