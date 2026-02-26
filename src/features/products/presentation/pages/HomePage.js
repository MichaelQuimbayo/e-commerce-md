import React from 'react';
import Link from 'next/link';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import TestimonialsSection from '../../../testimonials/presentation/components/TestimonialsSection';
import GuaranteesSection from '../../../../shared/components/GuaranteesSection';
import { useProducts } from '../../infrastructure/data/useProducts';
import ModelingCarousel from '../components/ModelingCarousel'; // Import the ModelingCarousel

const PRODUCT_LIMIT = 12;

const HeroSection = () => (
  <div className="relative h-[80vh] min-h-[400px] flex items-center justify-center text-center text-white">
    <div className="absolute inset-0">
      <img
        className="w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Hombre entrenando"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
    <div className="relative max-w-2xl mx-auto px-4">
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">
        Eleva tu Rendimiento
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-stone-200">
        Diseño premium y tecnología de vanguardia para el atleta moderno.
      </p>
      <div className="mt-8">
        <Link href="/shop" className="inline-block bg-white text-stone-900 font-semibold px-8 py-3 rounded-lg hover:bg-stone-200 transition-colors">
          Ver colección
        </Link>
      </div>
    </div>
  </div>
);

const BenefitsSection = () => (
  <div className="py-24 sm:py-32"> {/* Removed background color */}
    <div className="max-w-8xl mx-auto px-6 lg:px-8">
      <div className="max-w-2xl mx-auto lg:text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
          Diseñado para el Movimiento
        </h2>
        <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
          Cada pieza está meticulosamente confeccionada para fusionar estilo, comodidad y un rendimiento sin concesiones.
        </p>
      </div>
    </div>
  </div>
);

export default function HomePage({ testimonials, products: serverProducts }) {
  const { products: clientProducts, isLoading } = useProducts();
  
  const products = clientProducts && clientProducts.length > 0 ? clientProducts : serverProducts;

  const displayedProducts = products ? products.slice(0, PRODUCT_LIMIT) : [];

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div className="bg-gray-100 dark:bg-gray-900 py-16 sm:py-20">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">Para ti</h2>

            {isLoading && <p className="text-center mt-6 text-stone-500">Cargando productos...</p>}

            <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={{
                  id: product.id,
                  name: product.name,
                  price: product.displayPrice, // Using the clean getter from our entity
                  originalPrice: product.displayOriginalPrice,
                  image: product.primaryImage, // Use primaryImage getter
                  slug: product.productSlug,   // Use productSlug getter
                  status: product.status,
                  rating: product.rating,
                }} />
              ))}
            </div>

            {products && products.length > PRODUCT_LIMIT && (
              <div className="mt-12 text-center">
                <Link href="/shop" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver más productos
                </Link>
              </div>
            )}
          </div>
          <GuaranteesSection />
          <ModelingCarousel products={products} />
          <TestimonialsSection testimonials={testimonials} />

          <BenefitsSection />
        </div>


      </main>
      <Footer />
    </>
  );
}