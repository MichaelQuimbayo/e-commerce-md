import React from 'react';
import Link from 'next/link';
import { Truck, Heart, Star } from 'lucide-react';
import { useFavorites } from '../../../../shared/context/FavoritesContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-stone-300 dark:text-stone-600 fill-current'
        }
      />
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // The component now expects pre-formatted price strings.
  // const price = parseFloat(product.price.replace('$', ''));
  // const originalPrice = product.originalPrice ? parseFloat(product.originalPrice.replace('$', '')) : null;
  const isSoldOut = product.status === 'sold-out';

  // --- LÓGICA MEJORADA PARA ENCONTRAR LA IMAGEN ---
  let displayImage = '';
  if (product.colors && typeof product.colors[0] === 'object' && product.colors[0].images) {
    displayImage = product.colors[0].images[0];
  } else if (product.images && product.images.length > 0) {
    displayImage = product.images[0];
  } else {
    displayImage = product.image;
  }

  let badgeText = product.badge;
  let badgeColor = 'bg-blue-600';

  if (isSoldOut) {
    badgeText = 'Agotado';
    badgeColor = 'bg-stone-500';
  } else if (product.originalPrice) {
    // Discount logic is temporarily commented out as it requires raw numbers, not formatted strings.
    // A future refactor could pass raw price numbers to this component if this logic is needed.
    // const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
    // badgeText = `${discountPercentage}% OFF`;
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const cardContent = (
    <div className={`group flex flex-col h-full bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden transition-all duration-300 ${isSoldOut ? 'opacity-50 grayscale' : 'hover:shadow-lg'}`}>
      <div className="relative w-full h-64 sm:h-80 bg-stone-200 overflow-hidden">
        {badgeText && (
          <div className={`absolute top-3 left-3 z-10 ${badgeColor} text-white text-sm font-semibold px-3 py-1.5 rounded-full`}>
            {badgeText}
          </div>
        )}
        
        {!isSoldOut && (
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm rounded-full"
            aria-label="Añadir a favoritos"
          >
            <Heart 
              className={`transition-colors ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-stone-700 dark:text-stone-300'}`} 
              size={20} 
            />
          </button>
        )}

        <img
          src={displayImage} // <-- Usamos la imagen correcta
          alt={product.name}
          className={`w-full h-full object-center object-cover ${!isSoldOut && 'group-hover:scale-105 transition-transform duration-300'}`}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-medium text-stone-800 dark:text-stone-200 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>
        
        {/*
        {product.rating && !isSoldOut && (
          <div className="mt-1 mb-2">
            <StarRating rating={product.rating} />
          </div>
        )}
        */}

        <div className="flex-grow">
          {/*
          {product.originalPrice && !isSoldOut && (
            <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 line-through">
              {product.originalPrice}
            </p>
          )}
          */}
          <p className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white">
            {product.price}
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

  if (isSoldOut) {
    return <div className="pointer-events-none h-full">{cardContent}</div>;
  }

  return (
    <Link href={`/product/${product.slug}-${product.id}`} className="h-full">
      {cardContent}
    </Link>
  );
};

export default ProductCard;
