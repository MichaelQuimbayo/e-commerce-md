import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const NavLink = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href || (href.startsWith('/category') && router.asPath === href);

  return (
    <Link href={href} className={`flex items-center h-full text-base font-medium transition-colors ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'}`}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-20 bg-stone-50/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-700">
        <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* --- SECCIÓN IZQUIERDA --- */}
            {/* En móvil, contiene el botón de hamburguesa. En desktop, el logo. */}
            <div className="flex-1 md:flex-grow-0">
              <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="p-2 -ml-2 rounded-md text-stone-500">
                  <Menu size={24} />
                </button>
              </div>
              <div className="hidden md:block">
                <Link href="/" className="font-serif text-2xl font-bold text-stone-900 dark:text-white whitespace-nowrap">
                  AV-STORE
                </Link>
              </div>
            </div>

            {/* --- SECCIÓN CENTRAL --- */}
            {/* En móvil, contiene el logo centrado. En desktop, la navegación centrada. */}
            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
              <div className="md:hidden">
                <Link href="/" className="font-serif text-2xl font-bold text-stone-900 dark:text-white whitespace-nowrap">
                  AV-STORE
                </Link>
              </div>
              <div className="hidden md:flex h-full items-center space-x-8">
                <NavLink href="/">Inicio</NavLink>
                <NavLink href="/category/hombre">Hombre</NavLink>
                <NavLink href="/category/mujer">Mujer</NavLink>
                <NavLink href="/shop">Colección</NavLink>
              </div>
            </div>

            {/* --- SECCIÓN DERECHA --- */}
            {/* Contiene los iconos de acción y un espaciador invisible para móvil */}
            <div className="flex-1 md:flex-grow-0 flex justify-end items-center space-x-3 sm:space-x-5">
              <div className="md:hidden w-6"></div> {/* Espaciador invisible para centrar el logo en móvil */}
              {/*<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="hidden sm:block p-2 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors" aria-label="Toggle dark mode">
                {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                </button>*/}
              <Link href="/favorites" className="p-2 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors" aria-label="Favoritos">
                <Heart size={22} className={router.pathname === '/favorites' ? 'text-blue-600 fill-blue-600' : ''} />
              </Link>
              <button onClick={toggleCart} className="relative p-2 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors" aria-label="Open cart">
                <ShoppingCart size={22} />
                {totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">{totalItems}</span>}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Panel del Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
          <div className="relative w-72 max-w-[calc(100%-3rem)] bg-stone-50 dark:bg-gray-800 h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif text-2xl font-bold">AV-STORE</span>
              <button onClick={toggleMobileMenu} className="p-2 -mr-2 rounded-md"><X size={24} /></button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className={`text-lg font-medium ${router.pathname === '/' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Inicio</Link>
              <Link href="/category/hombre" className={`text-lg font-medium ${router.asPath === '/category/hombre' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Hombre</Link>
              <Link href="/category/mujer" className={`text-lg font-medium ${router.asPath === '/category/mujer' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Mujer</Link>
              <Link href="/shop" className={`text-lg font-medium ${router.pathname === '/shop' ? 'text-blue-600' : 'text-stone-800 dark:text-stone-200'}`}>Colección</Link>
            </nav>
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={toggleCart} />
    </>
  );
};

export default Navbar;
