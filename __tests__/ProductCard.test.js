import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard'; // <-- Ruta corregida
import '@testing-library/jest-dom';

// Mock del componente Link de Next.js
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('ProductCard Component', () => {
  const productWithDiscount = {
    id: 1,
    name: 'Camiseta con Descuento',
    originalPrice: '$100.00',
    price: '$80.00',
    image: 'test.jpg',
  };

  const productWithoutDiscount = {
    id: 2,
    name: 'Producto sin Descuento',
    price: '$50.00',
    image: 'test2.jpg',
    badge: 'Nuevo'
  };

  it('debe mostrar el precio final y el nombre', () => {
    render(<ProductCard product={productWithoutDiscount} />);

    expect(screen.getByText('Producto sin Descuento')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('debe mostrar el precio original tachado y el badge de descuento', () => {
    render(<ProductCard product={productWithDiscount} />);

    const originalPrice = screen.getByText('$100.00');
    expect(originalPrice).toBeInTheDocument();
    expect(originalPrice).toHaveClass('line-through');

    expect(screen.getByText('$80.00')).toBeInTheDocument();
    expect(screen.getByText('20% OFF')).toBeInTheDocument();
  });

  it('no debe mostrar el precio original si no existe', () => {
    render(<ProductCard product={productWithoutDiscount} />);

    const originalPrice = screen.queryByText('$100.00');
    expect(originalPrice).not.toBeInTheDocument();
  });

  it('debe mostrar un badge estático si no hay descuento', () => {
    render(<ProductCard product={productWithoutDiscount} />);
    
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });
});
