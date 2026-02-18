import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useCart } from '../../../../shared/context/CartContext';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import { Plus, Minus, ChevronDown, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const RelatedProducts = ({ currentProduct, allProducts }) => {
  const related = allProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
  if (related.length === 0) return null;
  return (
    <div className="mt-24">
      <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-white">También te podría interesar</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default function ProductDetailPage({ product, allProducts }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [selectedImage, setSelectedImage] = useState(() => {
    const firstColor = product?.colors[0];
    if (typeof firstColor === 'object' && firstColor.images) return firstColor.images[0];
    return product?.image || (product?.images ? product.images[0] : '');
  });
  const [quantity, setQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
        setActiveImageIndex(index);
      }
    };
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (product) {
      const initialColor = product.colors[0];
      setSelectedColor(initialColor);
      setSelectedSize(product.sizes[0]);
      const initialImage = (typeof initialColor === 'object' && initialColor.images) ? initialColor.images[0] : (product.image || product.images?.[0]);
      setSelectedImage(initialImage);
      setActiveImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    if (selectedColor && typeof selectedColor === 'object' && selectedColor.images) {
      setSelectedImage(selectedColor.images[0]);
      setActiveImageIndex(0);
    }
  }, [selectedColor]);

  if (!product) return <div className="flex items-center justify-center h-screen"><p>Producto no encontrado.</p></div>;

  const pageTitle = `${product.name} | ATHLOS`;
  const currentImages = (typeof selectedColor === 'object' && selectedColor.images) ? selectedColor.images : (product.images || [product.image]);

  const handleAction = (e, actionType) => {
    e.preventDefault();
    const colorName = typeof selectedColor === 'object' ? selectedColor.name : selectedColor;
    const productToAdd = { ...product, color: colorName, size: selectedSize, price: parseFloat(product.price.replace('$', '')) };
    addToCart(productToAdd, quantity);
    if (actionType === 'buy') {
      router.push('/checkout');
    } else {
      showMessage(`¡'${product.name}' (${colorName}) añadido al carrito!`);
    }
  };
  
  const showMessage = (message) => {
    setAddedToCartMessage(message);
    setTimeout(() => setAddedToCartMessage(''), 3000);
  };

  return (
    <>
      <Head><title>{pageTitle}</title></Head>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-x-8 lg:gap-x-16">
          <div>
            <div className="md:hidden relative">
              <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-lg">
                {currentImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0 snap-center">
                    <div className="aspect-square bg-stone-200"><img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain" /></div>
                  </div>
                ))}
              </div>
              {currentImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {currentImages.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full transition-colors ${activeImageIndex === index ? 'bg-blue-600' : 'bg-stone-300'}`} />
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-stone-200">
                <img src={selectedImage} alt={`${product.name} - ${typeof selectedColor === 'object' ? selectedColor.name : selectedColor}`} className="w-full h-full object-contain" />
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-3 overflow-x-auto p-2 scrollbar-hide">
                  {currentImages.map((image, index) => (
                    <button key={index} onClick={() => setSelectedImage(image)} className={`flex-shrink-0 aspect-square w-20 h-20 rounded-md overflow-hidden bg-stone-200 p-1 transition-all ${selectedImage === image ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:opacity-80'}`}>
                      <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">{product.name}</h1>
            <p className="text-2xl mt-4">{product.price}</p>
            <form className="mt-10">
              <div>
                <h3 className="text-sm font-medium">Color: <span className="font-semibold">{typeof selectedColor === 'object' ? selectedColor.name : selectedColor}</span></h3>
                <div className="flex items-center space-x-3 mt-3">
                  {product.colors.map((colorOption) => {
                    const isObject = typeof colorOption === 'object';
                    const name = isObject ? colorOption.name : colorOption;
                    const hex = isObject ? colorOption.colorHex : name.toLowerCase();
                    const isSelected = (typeof selectedColor === 'object' ? selectedColor.name : selectedColor) === name;
                    return <button key={name} type="button" onClick={() => setSelectedColor(colorOption)} className={`h-8 w-8 rounded-full border border-stone-300 dark:border-stone-600 transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} style={{ backgroundColor: hex }} />
                  })}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-medium">Talla: <span className="font-semibold">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.sizes.map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`border rounded-lg py-2 px-4 text-sm font-medium transition-colors ${selectedSize === size ? 'bg-stone-900 text-white dark:bg-stone-200 dark:text-stone-900 border-stone-900 dark:border-stone-200' : 'border-stone-300 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800'}`}>{size}</button>)}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-medium">Cantidad</h3>
                <div className="flex items-center border border-stone-300 dark:border-stone-600 rounded-lg mt-3" style={{ width: 'fit-content' }}>
                  <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 rounded-l-lg"><Minus size={16} /></button>
                  <span className="px-4">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(q => q + 1)} className="p-3 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-lg"><Plus size={16} /></button>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <button type="button" onClick={(e) => handleAction(e, 'buy')} className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">Comprar ahora</button>
                <button type="button" onClick={(e) => handleAction(e, 'add')} className="w-full bg-transparent border border-blue-600 text-blue-600 py-4 px-8 rounded-lg text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Añadir al carrito</button>
                {addedToCartMessage && <div className="mt-2 flex items-center justify-center text-green-600"><CheckCircle className="h-5 w-5 mr-2" /><p className="text-sm font-medium">{addedToCartMessage}</p></div>}
              </div>
            </form>
            <div className="mt-12 space-y-4">
              <details className="group border-b border-stone-300 dark:border-stone-700 pb-4"><summary className="flex justify-between items-center cursor-pointer list-none"><span className="font-medium">Descripción</span><ChevronDown className="group-open:rotate-180 transition-transform" /></summary><p className="mt-4 text-stone-600 dark:text-stone-400">{product.description}</p></details>
              <details className="group border-b border-stone-300 dark:border-stone-700 pb-4"><summary className="flex justify-between items-center cursor-pointer list-none"><span className="font-medium">Envío y Devoluciones</span><ChevronDown className="group-open:rotate-180 transition-transform" /></summary><p className="mt-4 text-stone-600 dark:text-stone-400">Envío estándar gratuito en todos los pedidos. Devoluciones aceptadas dentro de los 30 días.</p></details>
            </div>
          </div>
        </div>
        <RelatedProducts currentProduct={product} allProducts={allProducts} />
      </main>
      <Footer />
    </>
  );
}
