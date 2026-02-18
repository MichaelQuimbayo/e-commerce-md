import React from 'react';
import { useCart } from '../context/CartContext';
import { X } from 'lucide-react';
import { useRouter } from 'next/router';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-30" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"></div>
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
                          cartItems.map((product) => (
                            <li key={product.variantId} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-stone-200 dark:border-stone-700">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium">
                                    <h3>{product.name}</h3>
                                    <p className="ml-4">${(product.price * product.quantity).toFixed(2)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-stone-500">{product.color} / {product.size}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center">
                                    <label htmlFor={`quantity-${product.variantId}`} className="mr-2 text-stone-500">
                                      Cant.
                                    </label>
                                    <input
                                      id={`quantity-${product.variantId}`}
                                      type="number"
                                      value={product.quantity}
                                      onChange={(e) => updateQuantity(product.variantId, parseInt(e.target.value))}
                                      className="w-16 rounded-md border-stone-300 py-1 text-center text-base font-medium leading-5 shadow-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 sm:text-sm dark:bg-stone-700 dark:border-stone-600"
                                    />
                                  </div>
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                                      onClick={() => removeFromCart(product.variantId)}
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
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">
                      Envío e impuestos se calculan al finalizar la compra.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleCheckout}
                        className="flex w-full items-center justify-center rounded-lg border border-transparent bg-stone-800 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-stone-900 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-white"
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
