import '../src/index.css';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '../src/shared/context/CartContext';
import { FavoritesProvider } from '../src/shared/context/FavoritesContext';
import { Inter, Lora } from 'next/font/google';
import { SWRConfig } from 'swr';
import { fetcher } from '../src/shared/lib/api';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
});

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <CartProvider>
          <FavoritesProvider>
            {/* Wrap the main content with a div for global background */}
            <div className="bg-stone-100 min-h-screen">
              <main className={`${inter.variable} ${lora.variable} font-sans`}>
                <Component {...pageProps} />
              </main>
            </div>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default MyApp;
