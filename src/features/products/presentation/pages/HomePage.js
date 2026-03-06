import React from 'react';
import Link from 'next/link';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import TestimonialsSection from '../../../testimonials/presentation/components/TestimonialsSection';
import GuaranteesSection from '../../../../shared/components/GuaranteesSection';
import { useProducts } from '../../infrastructure/data/useProducts';
import ModelingCarousel from '../components/ModelingCarousel';
import HeroCarousel from '../../../../shared/components/HeroCarousel';

const PRODUCT_LIMIT = 12;

// Datos para el carrusel principal
const slides = [
  {
    image: '/images/tienda_de_ropa_deportiva.png',
    title: 'Eleva tu Rendimiento',
    subtitle: 'Diseño premium y tecnología de vanguardia para el atleta moderno.',
    cta: 'Ver colección',
    link: '/shop'
  },
  {
    image: '/images/camisetas_de_futbol_04.png',
    title: 'Velocidad y Estilo',
    subtitle: 'Tecnología que te impulsa más allá de tus límites.',
    cta: 'Descubre Novedades',
    link: '/shop'
  },
  {
    image: '/images/camisetas_de_futbol.png',
    title: 'Flexibilidad sin Compromisos',
    subtitle: 'Confort y diseño que se mueven contigo.',
    cta: 'Explora Yoga',
    link: '/shop'
  }
];

const BenefitsSection = () => (
  <div className="py-24 sm:py-32">
    <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
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

export default function HomePage({ testimonials, products: serverProductGroups }) {
  const { products: clientProductGroups, isLoading } = useProducts();
  
  // Prioritize client-side data if available, otherwise use server-side data
  const productGroups = clientProductGroups && clientProductGroups.length > 0 
    ? clientProductGroups 
    : serverProductGroups;

  const displayedProductGroups = productGroups 
    ? productGroups.slice(0, PRODUCT_LIMIT)
    : [];

  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel slides={slides} />
        <div className="py-16 sm:py-20">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">Mas destacados</h2>

            {isLoading && <p className="text-center mt-6 text-stone-500">Cargando productos...</p>}

            <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {displayedProductGroups
                .filter(Boolean) // Filter out any null/undefined groups for robustness
                .map((group) => (
                  <ProductCard key={group.groupCode} group={group} />
                ))}
            </div>

            {productGroups && productGroups.length > PRODUCT_LIMIT && (
              <div className="mt-12 text-center">
                <Link href="/shop" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver más productos
                </Link>
              </div>
            )}
          </div>
          <GuaranteesSection />
          <ModelingCarousel products={productGroups} /> {/* Pass grouped products to carousel */}
          <TestimonialsSection testimonials={testimonials} />

          <BenefitsSection />
        </div>


      </main>
      <Footer />
    </>
  );
}
