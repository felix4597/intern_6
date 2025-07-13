export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "에코 텀블러",
    price: 12900,
    imageUrl: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "블루투스 스피커",
    price: 25900,
    imageUrl: "/images/product2.jpg",
  },
  {
    id: 3,
    name: "무드등 스탠드",
    price: 19900,
    imageUrl: "/images/product3.jpg",
  },
  {
    id: 4,
    name: "휴대용 선풍기",
    price: 15900,
    imageUrl: "/images/product4.jpg",
  },
];