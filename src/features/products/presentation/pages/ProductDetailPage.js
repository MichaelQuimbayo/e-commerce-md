import React, { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { useCart } from '../../../../shared/context/CartContext';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import { Plus, Minus, ChevronDown, CheckCircle } from 'lucide-react';
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

export default function ProductDetailPage({ productGroup: serverProductGroup, currentVariantId }) {
  const productGroupEntities = useMemo(() => 
    serverProductGroup ? serverProductGroup.map(p => new ProductEntity(p)) : []
  , [serverProductGroup]);

  const router = useRouter();
  const { addToCart } = useCart();

  const initialVariant = useMemo(() => 
    productGroupEntities.find(v => v.id === currentVariantId) || productGroupEntities[0]
  , [productGroupEntities, currentVariantId]);

  // --- STATE MANAGEMENT (CONTROLLER LOGIC) ---
  // 1. User's selection state (source of intent)
  const [selectedColor, setSelectedColor] = useState(initialVariant?.color);
  const [selectedSize, setSelectedSize] = useState(initialVariant?.size);

  // 2. Resulting active variant state (the outcome of the selection)
  const [activeVariant, setActiveVariant] = useState(initialVariant);
  
  // 3. Effect that reacts to user's selection and finds the result
  useEffect(() => {
    const foundVariant = findVariant(productGroupEntities, selectedColor, selectedSize);
    setActiveVariant(foundVariant || null); // Set to found variant or null if combination is invalid

    // If a valid variant is found, update the URL. This does NOT cause a loop.
    if (foundVariant && foundVariant.id !== (router.query.slug?.slice(-36))) {
        router.replace(
            `/product/${foundVariant.productSlug}-${foundVariant.id}`,
            undefined,
            { shallow: true }
        );
    }
  }, [selectedColor, selectedSize, productGroupEntities, router]); // router object is stable enough

  const [quantity, setQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState('');

  // --- RENDER LOGIC --- 
  if (!initialVariant) {
    return <div className="flex items-center justify-center h-screen"><p>Producto no encontrado.</p></div>;
  }

  // Values for display are based on the activeVariant if it exists, otherwise fall back to initial/first variant
  const displayVariant = activeVariant || initialVariant;
  const pageTitle = `${displayVariant.name} | ATHLOS`;
  const availableColors = getUniqueOptions(productGroupEntities, 'color');
  const availableSizes = getUniqueOptions(productGroupEntities, 'size');

  const handleAction = (e, actionType) => {
    e.preventDefault();
    if (!activeVariant) return; // Prevent action if combination is invalid

    const productToAdd = { ...activeVariant, color: selectedColor, size: selectedSize };
    addToCart(productToAdd, quantity);

    if (actionType === 'buy') router.push('/checkout');
    else showMessage(`¡'${activeVariant.name}' añadido al carrito!`);
  };
  
  const showMessage = (message) => {
    setAddedToCartMessage(message);
    setTimeout(() => setAddedToCartMessage(''), 3000);
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
              <img src={displayVariant.primaryImage || 'https://via.placeholder.com/400'} alt={`${displayVariant.name} - ${displayVariant.color}`} className="w-full h-full object-contain" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-3 overflow-x-auto p-2 scrollbar-hide">
                {displayVariant.resources.filter(r => r.content_type?.startsWith('image/')).map((resource, index) => (
                  <button key={index} type="button" className={`flex-shrink-0 aspect-square w-20 h-20 rounded-md overflow-hidden bg-stone-200 p-1 transition-all`}>
                    <img src={resource.url} alt={`${displayVariant.name} thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- Details Section --- */}
          <div className="mt-8 md:mt-0">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">{displayVariant.name}</h1>
            <p className="text-2xl mt-4">{activeVariant ? activeVariant.displayPrice : '--'}</p>
            <form className="mt-10">

              {/* Color Selector */}
              {availableColors.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium">Color: <span className="font-semibold">{selectedColor}</span></h3>
                  <div className="flex items-center space-x-3 mt-3">
                    {availableColors.map((color) => (
                      <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`h-8 w-8 rounded-full border border-stone-300 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} style={{ backgroundColor: color.toLowerCase() }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {availableSizes.length > 1 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium">Talla: <span className="font-semibold">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {availableSizes.map((size) => (
                      <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`border rounded-lg py-2 px-4 text-sm font-medium transition-colors ${selectedSize === size ? 'bg-stone-900 text-white' : 'border-stone-300 hover:bg-stone-100'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Display */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  Disponible: {activeVariant ? activeVariant.stock : 'Combinación no disponible'}
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
            
            {/* Description Details */}
            <div className="mt-12 space-y-4">
              <details className="group border-b border-stone-300 pb-4"><summary className="flex justify-between items-center cursor-pointer list-none"><span className="font-medium">Descripción</span><ChevronDown className="group-open:rotate-180" /></summary><p className="mt-4 text-stone-600">{displayVariant.description}</p></details>
              <details className="group border-b border-stone-300 pb-4"><summary className="flex justify-between items-center cursor-pointer list-none"><span className="font-medium">Envío y Devoluciones</span><ChevronDown className="group-open:rotate-180" /></summary><p className="mt-4 text-stone-600">Envío estándar gratuito en todos los pedidos. Devoluciones aceptadas dentro de los 30 días.</p></details>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
