// pages/index.js
import HomePage from '../src/features/products/presentation/pages/HomePage';

// Se mantienen los repositorios para obtener los datos
import { InMemoryProductRepository } from '../src/features/products/infrastructure/repositories/InMemoryProductRepository';
import { GetAllProducts } from '../src/features/products/application/useCases/GetAllProducts';
import { InMemoryTestimonialRepository } from '../src/features/testimonials/infrastructure/repositories/InMemoryTestimonialRepository';
import { GetAllTestimonials } from '../src/features/testimonials/application/useCases/GetAllTestimonials';

export default HomePage;

export async function getStaticProps() {
  let products = [];
  let testimonials = [];

  try {
    // Intenta obtener los productos. InMemoryProductRepository hace el fetch.
    // Si este fetch falla, el bloque catch lo manejará.
    const productRepository = new InMemoryProductRepository();
    const getAllProducts = new GetAllProducts(productRepository);
    products = await getAllProducts.execute();
  } catch (error) {
    console.error("Error fetching products during build:", error);
    // Si falla, `products` se quedará como un array vacío, permitiendo que el build continúe.
  }

  try {
    // Los testimonios son locales, por lo que esto no debería fallar.
    const testimonialRepository = new InMemoryTestimonialRepository();
    const getAllTestimonials = new GetAllTestimonials(testimonialRepository);
    testimonials = await getAllTestimonials.execute();
  } catch (error) {
    console.error("Error fetching testimonials during build:", error);
    // Si falla, `testimonials` se quedará como un array vacío.
  }

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      testimonials: JSON.parse(JSON.stringify(testimonials)),
    },
    // Revalida la página cada 1 hora (3600 segundos) para mantener los datos frescos
    revalidate: 3600,
  };
}
