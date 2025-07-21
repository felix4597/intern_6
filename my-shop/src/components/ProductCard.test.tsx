import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('상품 이름과 가격을 표시해야 한다', () => {
    const product = {
      id: 1,
      name: '신발 A',
      price: 32000,
      imageUrl: '/images/shoe-a.jpg',
      description: '편안하고 스타일리시한 신발 A입니다.',  // 필수 필드 추가
    };

    const mockAddToCart = jest.fn();

    render(<ProductCard product={product} onAddToCart={mockAddToCart} />);

    expect(screen.getByText('신발 A')).toBeInTheDocument();
    expect(screen.getByText('32,000원')).toBeInTheDocument();
  });

  it('버튼을 클릭하면 onAddToCart가 호출된다', () => {
    const product = {
      id: 2,
      name: '신발 B',
      price: 25900,
      imageUrl: '/images/shoe-b.jpg',
      description: '가볍고 내구성 좋은 신발 B입니다.',  // 필수 필드 추가
    };

    const mockAddToCart = jest.fn();

    render(<ProductCard product={product} onAddToCart={mockAddToCart} />);

    const button = screen.getByRole('button', { name: '담기' });
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(button).toHaveTextContent('담김');
  });
});
