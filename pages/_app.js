import '../src/index.css';
import { ThemeProvider } from 'next-themes';
import { CartProvider } from '../src/shared/context/CartContext';
import { FavoritesProvider } from '../src/shared/context/FavoritesContext'; // <-- Importamos el nuevo provider
import { Inter, Lora } from 'next/font/google';

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
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>
        <FavoritesProvider> {/* <-- Lo envolvemos aquí */}
          <main className={`${inter.variable} ${lora.variable} font-sans`}>
            <Component {...pageProps} />
          </main>
        </FavoritesProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default MyApp;
