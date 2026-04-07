import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/router';

// Helper to format currency consistently
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();

  const subtotal = getCartTotal();

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-30" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-scroll bg-stone-50 dark:bg-gray-800 shadow-xl text-stone-800 dark:text-stone-200">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="font-serif text-2xl font-medium" id="slide-over-title">
                      Mi Cesta
                    </h2>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="-m-2 p-2 text-stone-400 hover:text-stone-500"
                        onClick={onClose}
                        >
                        <span className="sr-only">Cerrar panel</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-stone-200 dark:divide-stone-700">
                        {cartItems.length > 0 ? (
                          cartItems.map((item) => (
                            <li key={item.variantId} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-stone-200 dark:border-stone-700">
                                <img
                                  src={item.image || 'https://via.placeholder.com/150'}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-stone-500">{item.color} / {item.size}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  {/* New Quantity Stepper */}
                                  <div className="flex items-center border border-stone-300 rounded-md">
                                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-2 disabled:opacity-50" disabled={item.quantity <= 1}><Minus size={14}/></button>
                                    <span className="px-3 text-base font-medium">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-2 disabled:opacity-50" disabled={item.quantity >= item.stock}><Plus size={14}/></button>
                                  </div>
                                  
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-stone-600 hover:text-stone-500"
                                      onClick={() => removeFromCart(item.variantId)}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <p className="text-center text-stone-500 py-10">Tu cesta está vacía.</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t border-stone-200 dark:border-stone-700 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium">
                      <p>Subtotal</p>
                      <p>{formatCurrency(subtotal)}</p>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">
                      Envío e impuestos se calculan al finalizar la compra.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleCheckout}
                        className="flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                      >
                        Finalizar Compra
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
