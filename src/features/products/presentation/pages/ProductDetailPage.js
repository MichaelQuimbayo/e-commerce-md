import React, { useState, useEffect, useMemo, useRef, useReducer } from 'react';
import Head from 'next/head';
import { useCart } from '../../../../shared/context/CartContext';
import { useFavorites } from '../../../../shared/context/FavoritesContext';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import { Plus, Minus, ChevronDown, Star, Heart, Facebook, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { ProductEntity } from '../../domain/entities/ProductEntity';

// --- HELPERS ---
const getUniqueOptions = (variants, type) => {
  if (!variants) return [];
  const options = new Set(variants.map(v => v[type]).filter(Boolean));
  return Array.from(options);
};

const findVariant = (variants, color, size) => {
  if (!variants || !color || !size) return null;
  return variants.find(v => v.color === color && v.size === size) || null;
};

const getValidSizesForColor = (variants, color) => {
    return getUniqueOptions(variants.filter(v => v.color === color), 'size');
};

// --- STATE MANAGEMENT (useReducer) ---
const initialState = {
  selectedColor: null,
  selectedSize: null,
  activeVariant: null,
  selectedImage: null,
  quantity: 1,
};

function productStateReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case 'INITIALIZE': {
      const { initialVariant, variants, allColors, allSizes } = payload;
      const initialColor = allColors.length === 1 ? allColors[0] : initialVariant?.color;
      const validSizes = getValidSizesForColor(variants, initialColor);
      const initialSize = allSizes.length === 1 ? allSizes[0] : (validSizes.includes(initialVariant?.size) ? initialVariant.size : validSizes[0]);
      const activeVariant = findVariant(variants, initialColor, initialSize) || initialVariant;
      
      return {
          ...initialState, // BUG FIX: Reset from default state, not previous state
          selectedColor: initialColor,
          selectedSize: initialSize,
          activeVariant: activeVariant,
          selectedImage: activeVariant.primaryImage,
      };
    }
    case 'SELECT_COLOR': {
      const { color, variants } = payload;
      const validSizes = getValidSizesForColor(variants, color);
      const newSize = validSizes.includes(state.selectedSize) ? state.selectedSize : validSizes[0] || null;
      const newActiveVariant = findVariant(variants, color, newSize);
      return {
        ...state,
        selectedColor: color,
        selectedSize: newSize,
        activeVariant: newActiveVariant,
        selectedImage: newActiveVariant?.primaryImage || state.selectedImage,
      };
    }
    case 'SELECT_SIZE': {
      const { size, variants } = payload;
      const newActiveVariant = findVariant(variants, state.selectedColor, size);
      return {
        ...state,
        selectedSize: size,
        activeVariant: newActiveVariant,
        selectedImage: newActiveVariant?.primaryImage || state.selectedImage,
      };
    }
    case 'SET_QUANTITY': {
        const stockLimit = state.activeVariant ? state.activeVariant.stock : 0;
        const newQuantity = Math.max(1, payload.quantity);
        return {
            ...state,
            quantity: Math.min(newQuantity, stockLimit)
        };
    }
    case 'SELECT_IMAGE': {
        return {...state, selectedImage: payload.imageUrl };
    }
    default:
      return state;
  }
}

// --- RATING COMPONENT (for local use) ---
const ProductRating = ({ rating, reviewCount }) => (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-stone-300"} />
        ))}
      </div>
      {reviewCount !== null && (
        <span className="text-sm text-stone-500 ml-2">({reviewCount} reseñas)</span>
      )}
    </div>
  );

export default function ProductDetailPage({ productGroup: serverProductGroup, currentVariantId, relatedProducts }) {
  const productGroupEntities = useMemo(() => 
    serverProductGroup ? serverProductGroup.map(p => new ProductEntity(p)) : []
  , [serverProductGroup]);

  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const allAvailableColors = useMemo(() => getUniqueOptions(productGroupEntities, 'color'), [productGroupEntities]);
  const allAvailableSizes = useMemo(() => getUniqueOptions(productGroupEntities, 'size'), [productGroupEntities]);

  const initialVariant = useMemo(() => {
    return productGroupEntities.find(v => v.id === currentVariantId) || productGroupEntities[0];
  }, [productGroupEntities, currentVariantId]);

  const [state, dispatch] = useReducer(productStateReducer, initialState);
  const { selectedColor, selectedSize, activeVariant, selectedImage, quantity } = state;

  const [isMounted, setIsMounted] = useState(false);
  const [addedToCartMessage, setAddedToCartMessage] = useState('');
  const [reviewCount, setReviewCount] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    if (initialVariant) {
      dispatch({ type: 'INITIALIZE', payload: { initialVariant, variants: productGroupEntities, allColors: allAvailableColors, allSizes: allAvailableSizes } });
    }
  }, [initialVariant]);

  useEffect(() => {
    const currentSlugId = router.query.slug?.slice(-36);
    if (isMounted && activeVariant && activeVariant.id !== currentSlugId) {
      router.replace(`/product/${activeVariant.productSlug}-${activeVariant.id}`, undefined, { shallow: true });
    }
  }, [activeVariant, isMounted, router.query.slug]);

  useEffect(() => {
    setReviewCount(Math.floor(Math.random() * 50) + 10);
  }, [initialVariant]);

  const validSizesForSelectedColor = useMemo(() => 
      getValidSizesForColor(productGroupEntities, selectedColor)
  , [productGroupEntities, selectedColor]);

  const allImages = useMemo(() => {
    if (!initialVariant) return [];
    const imageUrls = new Set();
    productGroupEntities.forEach(p => {
        if(p.primaryImage) imageUrls.add(p.primaryImage);
        p.resources.filter(r => r.content_type?.startsWith('image/')).forEach(r => imageUrls.add(r.url));
    });
    return Array.from(imageUrls);
  }, [productGroupEntities]);

  const displayVariant = activeVariant || initialVariant;

  const handleAction = (e, actionType) => {
    e.preventDefault();
    if (!activeVariant || activeVariant.stock <= 0) return;
    const productToAdd = { ...activeVariant, color: selectedColor, size: selectedSize };
    addToCart(productToAdd, quantity);
    if (actionType === 'buy') router.push('/checkout');
    else showMessage(`¡'${displayVariant.name}' (${selectedColor}, ${selectedSize}) añadido al carrito!`);
  };
  
  const showMessage = (message) => {
    setAddedToCartMessage(message);
    setTimeout(() => setAddedToCartMessage(''), 3000);
  };

  const relatedProductsContainerRef = useRef(null);

  const handleRelatedScroll = (direction) => {
    const container = relatedProductsContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.75;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const rating = displayVariant?.rating || 4;

  if (!isMounted || !activeVariant) {
    return <div className="flex items-center justify-center h-screen"><p>Cargando producto...</p></div>;
  }

  return (
    <> 
      <Head><title>{`${displayVariant.name} | ATHLOS`}</title></Head>
      <Navbar />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="grid md:grid-cols-2 gap-x-8 lg:gap-x-16">
          {/* Image Section */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg border-2 bg-stone-200">
              <img src={selectedImage || 'https://via.placeholder.com/400'} alt={`${displayVariant.name} - ${displayVariant.color}`} className="w-full h-full object-contain transition-opacity duration-300" />
            </div>
            {allImages.length > 1 && (
              <div className="mt-4"><div className="flex items-center space-x-3 overflow-x-auto p-2 scrollbar-hide">
                  {allImages.map((imageUrl, index) => (
                    <button key={index} type="button" onClick={() => dispatch({ type: 'SELECT_IMAGE', payload: { imageUrl } }) } className={`flex-shrink-0 aspect-square w-20 h-20 rounded-md overflow-hidden bg-stone-200 p-1 transition-all ${selectedImage === imageUrl ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}>
                      <img src={imageUrl} alt={`${displayVariant.name} thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
              </div></div>
            )}
          </div>

          {/* Details Section */}
          <div className="mt-8 md:mt-0">
            <div className="flex justify-between items-start">
              <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">{displayVariant.name}</h1>
              <button onClick={() => toggleFavorite(displayVariant.groupCode)} className="p-2 rounded-full hover:bg-stone-100 transition-colors ml-4">
                <Heart className={`transition-colors ${isMounted && isFavorite(displayVariant.groupCode) ? 'text-red-500 fill-current' : 'text-stone-500'}`} size={28}/>
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <p className="text-stone-600 text-lg">{displayVariant.description}</p>
              <ProductRating rating={rating} reviewCount={reviewCount} />
            </div>
            <p className="text-3xl font-bold mt-6">{displayVariant.displayPrice}</p>
            <form className="mt-10">
              {allAvailableColors.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium">Color: <span className="font-semibold">{selectedColor}</span></h3>
                  <div className="flex items-center space-x-3 mt-3">
                    {allAvailableColors.map((color) => (
                      <button key={color} type="button" onClick={() => dispatch({ type: 'SELECT_COLOR', payload: { color, variants: productGroupEntities } })} className={`h-8 w-8 rounded-full border border-stone-300 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} style={{ backgroundColor: color.toLowerCase() }} />
                    ))}
                  </div>
                </div>
              )}
              {allAvailableSizes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium">Talla: <span className="font-semibold">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {allAvailableSizes.map((size) => (
                      <button key={size} type="button" onClick={() => dispatch({ type: 'SELECT_SIZE', payload: { size, variants: productGroupEntities } })} disabled={!validSizesForSelectedColor.includes(size)} className={`border rounded-lg py-2 px-4 text-sm font-medium transition-colors ${selectedSize === size ? 'bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-100'} ${!validSizesForSelectedColor.includes(size) ? 'opacity-30 cursor-not-allowed' : ''}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4"><p className="text-sm font-medium text-gray-900">Disponible: {activeVariant.stock > 0 ? activeVariant.stock : 'Agotado'}</p></div>
              <div className="mt-8">
                <h3 className="text-sm font-medium">Cantidad</h3>
                <div className="flex items-center border border-stone-300 rounded-lg mt-3" style={{ width: 'fit-content' }}>
                  <button type="button" onClick={() => dispatch({ type: 'SET_QUANTITY', payload: { quantity: quantity - 1 }})} className="p-3"><Minus size={16} /></button>
                  <span className="px-4">{quantity}</span>
                  <button type="button" onClick={() => dispatch({ type: 'SET_QUANTITY', payload: { quantity: quantity + 1 }})} className="p-3 disabled:opacity-30" disabled={quantity >= activeVariant.stock}><Plus size={16} /></button>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <button type="button" onClick={(e) => handleAction(e, 'buy')} disabled={activeVariant.stock <= 0} className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Comprar ahora</button>
                <button type="button" onClick={(e) => handleAction(e, 'add')} disabled={activeVariant.stock <= 0} className="w-full bg-transparent border border-blue-600 text-blue-600 py-4 px-8 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed">Añadir al carrito</button>
                {addedToCartMessage && <div className="mt-2 text-center text-green-600"><p>{addedToCartMessage}</p></div>}
              </div>
            </form>
            <div className="mt-10 pt-6 border-t">
                <h3 className="text-sm font-medium text-stone-800">Nuestras redes</h3>
                <div className="flex items-center space-x-4 mt-3">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors"><Facebook size={24}/></a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors"><Instagram size={24}/></a>
                </div>
            </div>
            <div className="mt-6 space-y-4">
              <details className="group border-b border-stone-300 pb-4"><summary className="flex justify-between items-center cursor-pointer list-none"><span className="font-medium">Envío y Devoluciones</span><ChevronDown className="group-open:rotate-180" /></summary><p className="mt-4 text-stone-600">Envío estándar gratuito. Devoluciones aceptadas dentro de los 30 días.</p></details>
            </div>
          </div>
        </div>
        {relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-16 py-10 border-t">
                <div className="relative">
                    <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white mb-8 text-center font-serif">También podría gustarte</h2>
                    <div ref={relatedProductsContainerRef} className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                      {relatedProducts.map((product) => (
                          <div key={product.groupCode} className="w-72 flex-shrink-0">
                              <ProductCard group={product} />
                          </div>                      ))}
                    </div>
                    <button onClick={() => handleRelatedScroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-stone-100 transition-colors z-10"><ChevronLeft size={24}/></button>
                    <button onClick={() => handleRelatedScroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-stone-100 transition-colors z-10"><ChevronRight size={24}/></button>
                </div>
            </section>
        )}
      </main>
      <Footer />
    </>
  );
}
