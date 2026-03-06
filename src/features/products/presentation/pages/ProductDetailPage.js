import React, { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { useCart } from '../../../../shared/context/CartContext';
import { useFavorites } from '../../../../shared/context/FavoritesContext';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import { Plus, Minus, ChevronDown, CheckCircle, Star, Heart, Facebook, Instagram } from 'lucide-react';
import { useRouter } from 'next/router';
import { ProductEntity } from '../../domain/entities/ProductEntity';

// --- HELPERS --- 
const getUniqueOptions = (variants, type) => {
  if (!variants) return [];
  const options = new Set();
  variants.forEach(variant => {
    const feature = variant.features.find(f => f.entity_type === type);
    if (feature && feature.value) {
      options.add(feature.value);
    }
  });
  return Array.from(options);
};

const findVariant = (variants, color, size) => {
  if (!variants) return null;
  return variants.find(variant => {
    const variantColor = variant.color;
    const variantSize = variant.size;
    const colorMatch = color ? variantColor === color : true;
    const sizeMatch = size ? variantSize === size : true;
    return colorMatch && sizeMatch;
  });
};

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

export default function ProductDetailPage({ productGroup: serverProductGroup, currentVariantId }) {
  const productGroupEntities = useMemo(() => 
    serverProductGroup ? serverProductGroup.map(p => new ProductEntity(p)) : []
  , [serverProductGroup]);

  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const allAvailableColors = useMemo(() => getUniqueOptions(productGroupEntities, 'color'), [productGroupEntities]);
  const allAvailableSizes = useMemo(() => getUniqueOptions(productGroupEntities, 'size'), [productGroupEntities]);

  const initialVariant = useMemo(() => {
    const found = productGroupEntities.find(v => v.id === currentVariantId);
    return found || productGroupEntities[0];
  }, [productGroupEntities, currentVariantId]);

  const [selectedColor, setSelectedColor] = useState(() => {
    if (allAvailableColors.length === 1) return allAvailableColors[0];
    return initialVariant?.color;
  });
  const [selectedSize, setSelectedSize] = useState(() => {
    if (allAvailableSizes.length === 1) return allAvailableSizes[0];
    return initialVariant?.size;
  });

  const [activeVariant, setActiveVariant] = useState(initialVariant);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const foundVariant = findVariant(productGroupEntities, selectedColor, selectedSize);
    setActiveVariant(foundVariant || null);
    const currentUrlVariantId = router.query.slug?.slice(-36);
    if (foundVariant && foundVariant.id !== currentUrlVariantId) {
        router.replace(
            `/product/${foundVariant.productSlug}-${foundVariant.id}`,
            undefined,
            { shallow: true }
        );
    }
  }, [selectedColor, selectedSize, productGroupEntities, router.query.slug, router]); 
  
  useEffect(() => {
    if (selectedColor) {
      const variantsForSelectedColor = productGroupEntities.filter(v => v.color === selectedColor);
      const validSizesForSelectedColor = getUniqueOptions(variantsForSelectedColor, 'size');
      if (validSizesForSelectedColor.length > 0 && (!selectedSize || !validSizesForSelectedColor.includes(selectedSize))) {
        setSelectedSize(validSizesForSelectedColor[0]);
      } else if (validSizesForSelectedColor.length === 0) {
        setSelectedSize(null);
      }
    } else {
        setSelectedSize(null); 
    }
  }, [selectedColor, productGroupEntities]); 

  const [quantity, setQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState('');
  
  if (!initialVariant) {
    return <div className="flex items-center justify-center h-screen"><p>Producto no encontrado.</p></div>;
  }

  const displayVariant = activeVariant || initialVariant;
  const pageTitle = `${displayVariant.name} | ATHLOS`;

  const allImages = useMemo(() => {
    if (!displayVariant) return [];
    const imageUrls = new Set();
    if (displayVariant.primaryImage) {
      imageUrls.add(displayVariant.primaryImage);
    }
    displayVariant.resources
      .filter(r => r.content_type?.startsWith('image/'))
      .forEach(r => imageUrls.add(r.url));
    return Array.from(imageUrls);
  }, [displayVariant]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);

  useEffect(() => {
    if (allImages.length > 0 && !selectedImage) {
        setSelectedImage(allImages[0]);
    }
  }, [allImages, selectedImage]);

  useEffect(() => {
      setReviewCount(Math.floor(Math.random() * 50) + 10);
  }, [displayVariant]);

  const variantsForSelectedColor = productGroupEntities.filter(v => v.color === selectedColor);
  const validSizesForSelectedColor = getUniqueOptions(variantsForSelectedColor, 'size');

  const handleAction = (e, actionType) => {
    e.preventDefault();
    if (!activeVariant || activeVariant.stock <= 0) return;
    const productToAdd = { ...activeVariant, color: selectedColor, size: selectedSize };
    addToCart(productToAdd, quantity);
    if (actionType === 'buy') router.push('/checkout');
    else showMessage(`¡'${activeVariant.name}' (${selectedColor}, ${selectedSize}) añadido al carrito!`);
  };
  
  const showMessage = (message) => {
    setAddedToCartMessage(message);
    setTimeout(() => setAddedToCartMessage(''), 3000);
  };

  const rating = displayVariant.rating || 4;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(displayVariant.groupCode); 
  };

  return (
    <> 
      <Head><title>{pageTitle}</title></Head>
      <Navbar />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="grid md:grid-cols-2 gap-x-8 lg:gap-x-16">
          {/* --- Image Section --- */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg border-2 bg-stone-200">
              <img src={selectedImage || 'https://via.placeholder.com/400'} alt={`${displayVariant.name} - ${displayVariant.color}`} className="w-full h-full object-contain transition-opacity duration-300" />
            </div>
            {allImages.length > 1 && (
              <div className="mt-4">
                <div className="flex items-center space-x-3 overflow-x-auto p-2 scrollbar-hide">
                  {allImages.map((imageUrl, index) => (
                    <button 
                      key={index} 
                      type="button" 
                      onClick={() => setSelectedImage(imageUrl)}
                      className={`flex-shrink-0 aspect-square w-20 h-20 rounded-md overflow-hidden bg-stone-200 p-1 transition-all ${selectedImage === imageUrl ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <img src={imageUrl} alt={`${displayVariant.name} thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- Details Section --- */}
          <div className="mt-8 md:mt-0">
            <div className="flex justify-between items-start">
              <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">{displayVariant.name}</h1>
              <button onClick={handleFavoriteClick} className="p-2 rounded-full hover:bg-stone-100 transition-colors ml-4">
                <Heart className={`transition-colors ${isMounted && isFavorite(displayVariant.groupCode) ? 'text-red-500 fill-current' : 'text-stone-500'}`} size={28}/>
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              <p className="text-stone-600 text-lg">{displayVariant.description}</p>
              <ProductRating rating={rating} reviewCount={reviewCount} />
            </div>

            <p className="text-3xl font-bold mt-6">{activeVariant ? activeVariant.displayPrice : '--'}</p>
            
            <form className="mt-10">

              {/* Color Selector */}
              {allAvailableColors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Color: <span className="font-semibold">{selectedColor}</span></h3>
                  <div className="flex items-center space-x-3 mt-3">
                    {allAvailableColors.map((color) => (
                      <button 
                        key={color} 
                        type="button" 
                        onClick={() => setSelectedColor(color)} 
                        className={`h-8 w-8 rounded-full border border-stone-300 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} 
                        style={{ backgroundColor: color.toLowerCase() }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector (with disabled logic) */}
              {allAvailableSizes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium">Talla: <span className="font-semibold">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {allAvailableSizes.map((size) => (
                      <button 
                        key={size} 
                        type="button" 
                        onClick={() => setSelectedSize(size)} 
                        disabled={!validSizesForSelectedColor.includes(size)} // Disable if not available for selected color
                        className={`border rounded-lg py-2 px-4 text-sm font-medium transition-colors 
                          ${selectedSize === size ? 'bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-100'} 
                          ${!validSizesForSelectedColor.includes(size) ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Display */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  Disponible: {activeVariant ? (activeVariant.stock > 0 ? activeVariant.stock : 'Agotado') : 'Combinación no disponible'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mt-8">
                <h3 className="text-sm font-medium">Cantidad</h3>
                <div className="flex items-center border border-stone-300 rounded-lg mt-3" style={{ width: 'fit-content' }}>
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3"><Minus size={16} /></button>
                  <span className="px-4">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => q + 1)} className="p-3"><Plus size={16} /></button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                <button type="button" onClick={(e) => handleAction(e, 'buy')} disabled={!activeVariant || activeVariant.stock <= 0} className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Comprar ahora
                </button>
                <button type="button" onClick={(e) => handleAction(e, 'add')} disabled={!activeVariant || activeVariant.stock <= 0} className="w-full bg-transparent border border-blue-600 text-blue-600 py-4 px-8 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Añadir al carrito
                </button>
                {addedToCartMessage && <div className="mt-2 text-center text-green-600"><p>{addedToCartMessage}</p></div>}
              </div>
            </form>

            {/* Social Share Section */}
            <div className="mt-10 pt-6 border-t">
                <h3 className="text-sm font-medium text-stone-800">Nuestras redes</h3>
                <div className="flex items-center space-x-4 mt-3">
                    <a href="https://www.facebook.com/tupagina" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors"><Facebook size={24}/></a>
                    <a href="https://www.instagram.com/tuusuario" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-stone-800 transition-colors"><Instagram size={24}/></a>
                    
                </div>
            </div>
            
            {/* Accordion Section */}
            <div className="mt-6 space-y-4">
              <details className="group border-b border-stone-300 pb-4"><summary className="flex justify-between items-center cursor-pointer list-none"><span className="font-medium">Envío y Devoluciones</span><ChevronDown className="group-open:rotate-180" /></summary><p className="mt-4 text-stone-600">Envío estándar gratuito en todos los pedidos. Devoluciones aceptadas dentro de los 30 días.</p></details>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
