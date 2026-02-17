import React, { useState, useMemo } from 'react';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function ShopPage({ products }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  return (
    <>
      <Navbar />
      <main className="bg-stone-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-white">
              Nuestra Colección
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-stone-600 dark:text-stone-400">
              Explora todo nuestro catálogo de ropa y accesorios deportivos de alto rendimiento.
            </p>
          </div>

          {/* Buscador */}
          <div className="mt-12 max-w-lg mx-auto">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-stone-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Marca, equipo y más..."
                className="block w-full rounded-md border-0 bg-white dark:bg-stone-800 py-3 pl-10 pr-3 text-stone-900 dark:text-stone-200 ring-1 ring-inset ring-stone-300 dark:ring-stone-700 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Cuadrícula de Productos */}
          <div className="mt-12">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-stone-600 dark:text-stone-400">
                  No se encontraron productos para "<strong>{searchTerm}</strong>".
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Intenta con otra búsqueda.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
