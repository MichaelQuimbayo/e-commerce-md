import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Heart, Star } from 'lucide-react';
import { useFavorites } from '../../../../shared/context/FavoritesContext';

// A helper function to format the price range
const formatPriceRange = (priceRange) => {
  if (!priceRange) return '';
  if (priceRange.min === priceRange.max) {
    return `$${priceRange.min.toLocaleString('es-CO')}`;
  }
  return `$${priceRange.min.toLocaleString('es-CO')} - $${priceRange.max.toLocaleString('es-CO')}`;
};

// Componente para mostrar las estrellas de calificación
const ProductRating = ({ rating, reviewCount }) => (
  <div className="flex items-center mb-2">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-stone-300 dark:text-stone-500"} />
      ))}
    </div>
    <span className="text-xs text-stone-500 dark:text-stone-400 ml-2">({reviewCount})</span>
  </div>
);

/**
 * A card component that displays a grouped product.
 * @param {{ group: import('../../application/services/productGrouping').GroupedProduct }} props
 */
const ProductCard = ({ group }) => {
  // --- FORTIFICACIÓN: Guard Clause --- //
  if (!group || !group.variants || group.variants.length === 0) {
    console.warn("ProductCard received invalid group prop:", group);
    return null; 
  }
  // --- FIN FORTIFICACIÓN --- //

  const { isFavorite, toggleFavorite } = useFavorites();
  const [reviewCount, setReviewCount] = useState(group.reviewCount || null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    if (group.reviewCount === undefined) {
      setReviewCount(Math.floor(Math.random() * 50) + 10);
    }
  }, [group.reviewCount]);

  // A group is considered out of stock only if all its variants are.
  const isSoldOut = group.variants.every(v => v.status === 'sold-out');
  const firstVariant = group.variants[0];

  // firstVariant is guaranteed to exist due to the guard clause, but still good to be explicit

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Use the groupCode for favorites, as it's the unique identifier for the group
    toggleFavorite(group.groupCode);
  };

  // Fake rating for demo purposes
  const rating = group.rating || 4;

  return (
    <Link href={`/product/${firstVariant.productSlug}-${firstVariant.id}`} className="h-full">
      <div className={`group flex flex-col h-full bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden transition-all duration-300 ${isSoldOut ? 'opacity-50 grayscale' : 'hover:shadow-lg'}`}>
        <div className="relative w-full h-64 sm:h-80 bg-stone-200 overflow-hidden">
          {isSoldOut && (
            <div className={`absolute top-3 left-3 z-10 bg-stone-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full`}>
              Agotado
            </div>
          )}
          
          {!isSoldOut && (
            <button 
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 z-10 p-1.5 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm rounded-full"
              aria-label="Añadir a favoritos"
            >
              <Heart 
                className={`transition-colors ${isMounted && isFavorite(group.groupCode) ? 'text-red-500 fill-current' : 'text-stone-700 dark:text-stone-300'}`} 
                size={20} 
              />
            </button>
          )}

          <img
            src={group.mainImage || 'https://via.placeholder.com/400'} 
            alt={group.name}
            className={`w-full h-full object-center object-cover ${!isSoldOut && 'group-hover:scale-105 transition-transform duration-300'}`}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base font-medium text-stone-800 dark:text-stone-200 min-h-[2.5rem] sm:min-h-[3rem]" title={group.name}>
            {group.name}
          </h3>
          {reviewCount !== null && <ProductRating rating={rating} reviewCount={reviewCount} />}
          
          <div className="flex-grow">
            <p className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-white">
              {formatPriceRange(group.priceRange)}
            </p>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
