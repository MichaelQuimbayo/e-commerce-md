import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-100 dark:bg-gray-800 border-t border-stone-200 dark:border-stone-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Columna de Tienda */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white tracking-wider uppercase">Tienda</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Camisetas</Link></li>
              <li><Link href="/shop" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Accesorios</Link></li>
              <li><Link href="/collection" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Colecciones</Link></li>
            </ul>
          </div>

          {/* Columna de Soporte */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white tracking-wider uppercase">Soporte</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Contacto</Link></li>
              <li><Link href="/faq" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Preguntas Frecuentes</Link></li>
              <li><Link href="/shipping" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Envíos y Devoluciones</Link></li>
            </ul>
          </div>

          {/* Columna Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white tracking-wider uppercase">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Política de Privacidad</Link></li>
              <li><Link href="/terms" className="text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">Términos y Condiciones</Link></li>
            </ul>
          </div>

          {/* Columna de Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-white tracking-wider uppercase">Síguenos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">
                  <Facebook className="h-6 w-6 mr-3" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">
                  <Instagram className="h-6 w-6 mr-3" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-base text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white">
                  <Twitter className="h-6 w-6 mr-3" />
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 dark:border-stone-700 pt-8">
          <p className="text-base text-stone-500 dark:text-stone-400 text-center">
            &copy; {new Date().getFullYear()} AV-STORE. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
