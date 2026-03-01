import React from 'react';
import Link from 'next/link';
import { Truck, Heart } from 'lucide-react';
import { useFavorites } from '../../../../shared/context/FavoritesContext';

// A helper function to format the price range
const formatPriceRange = (priceRange) => {
  if (!priceRange) return '';
  if (priceRange.min === priceRange.max) {
    return `$${priceRange.min.toLocaleString('es-CO')}`;
  }
  return `$${priceRange.min.toLocaleString('es-CO')} - $${priceRange.max.toLocaleString('es-CO')}`;
};

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

  const cardContent = (
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
              className={`transition-colors ${isFavorite(group.groupCode) ? 'text-red-500 fill-current' : 'text-stone-700 dark:text-stone-300'}`} 
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
        <h3 className="text-sm sm:text-base font-medium text-stone-800 dark:text-stone-200 min-h-[2.5rem] sm:min-h-[3rem]">
          {group.name}
        </h3>
        
        <div className="flex-grow">
          <p className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-white">
            {formatPriceRange(group.priceRange)}
          </p>
        </div>
        {!isSoldOut && (
          <div className="mt-3 flex items-center text-green-600">
            <Truck size={16} className="mr-1.5" />
            <span className="text-sm sm:text-base font-semibold">Envío gratis</span>
          </div>
        )}
      </div>
    </div>
  );

  // The card links to the detail page of the first variant
  // Ensure firstVariant has id and slug, which it should due to the guard clause.
  return (
    <Link href={`/product/${firstVariant.productSlug}-${firstVariant.id}`} className="h-full">
      {cardContent}
    </Link>
  );
};

export default ProductCard;
