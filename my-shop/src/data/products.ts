export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "상품 A",
    price: 32000,
    imageUrl: "/images/product1.png",
  },
  {
    id: 2,
    name: "상품 B",
    price: 25900,
    imageUrl: "/images/product2.png",
  },
  {
    id: 3,
    name: "상품 C",
    price: 21000,
    imageUrl: "/images/product3.png",
  },
  {
    id: 4,
    name: "상품 D",
    price: 15000,
    imageUrl: "/images/product4.png",
  },
];