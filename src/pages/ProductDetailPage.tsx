import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p className="text-center mt-10">상품을 찾을 수 없습니다.</p>;

  const handleAddToCart = () => {
    alert(`${product.name}를 장바구니에 담았습니다!`);
    navigate("/cart");
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-24">
      <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-xl" />
      <h1 className="mt-4 text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-700 text-lg mt-2">{product.price.toLocaleString()}원</p>
      <p className="text-sm text-gray-500 mt-2">이 상품은 매우 인기 있는 아이템입니다. 좋은 선택이에요!</p>
      <button
        onClick={handleAddToCart}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        장바구니 담기
      </button>
    </div>
  );
};

export default ProductDetailPage;