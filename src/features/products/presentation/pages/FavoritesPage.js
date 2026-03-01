import React from 'react';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../../../../shared/context/FavoritesContext';

export default function FavoritesPage({ products }) {
  const { favorites } = useFavorites();

  // Filtramos la lista completa de productos para quedarnos solo con los favoritos.
  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  return (
    <>
      <Navbar />
      <main className="bg-stone-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
            Mis Favoritos
          </h1>
          
          {favoriteProducts.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-lg text-stone-600 dark:text-stone-400">
                Aún no has guardado ningún favorito.
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Haz clic en el corazón de un producto para guardarlo aquí.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
