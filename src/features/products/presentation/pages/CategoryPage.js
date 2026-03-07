import React from 'react';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import Head from 'next/head';

export default function CategoryPage({ products, categoryName }) {
  // Capitaliza el nombre de la categoría para el título
  const title = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <>
      <Head>
        <title>Ropa para {title} | AV-STORE</title>
        <meta name="description" content={`Descubre nuestra colección de ropa deportiva para ${title}.`} />
      </Head>

      <Navbar />
      <main className="bg-stone-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-left mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
              Explora nuestra selección de prendas diseñadas para el rendimiento.
            </p>
          </div>

          {/* Cuadrícula de Productos */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-stone-600 dark:text-stone-400">
                No se encontraron productos en esta categoría por el momento.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
