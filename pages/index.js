// pages/index.js
import HomePage from '../src/features/products/presentation/pages/HomePage';

// Importamos la lógica de ambas features
import { InMemoryProductRepository } from '../src/features/products/infrastructure/repositories/InMemoryProductRepository';
import { GetAllProducts } from '../src/features/products/application/useCases/GetAllProducts';
import { InMemoryTestimonialRepository } from '../src/features/testimonials/infrastructure/repositories/InMemoryTestimonialRepository';
import { GetAllTestimonials } from '../src/features/testimonials/application/useCases/GetAllTestimonials';

export default HomePage;

export async function getServerSideProps() {
  // Obtenemos los productos (ya agrupados por el repositorio)
  const productRepository = new InMemoryProductRepository();
  const getAllProducts = new GetAllProducts(productRepository);
  const products = await getAllProducts.execute(); // 'products' here are GroupedProduct[]

  // Obtenemos los testimonios (asumiendo que testimonialRepository también devuelve instancias de clase)
  const testimonialRepository = new InMemoryTestimonialRepository();
  const getAllTestimonials = new GetAllTestimonials(testimonialRepository);
  const testimonials = await getAllTestimonials.execute();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)), // Aplicar serialización a los productos agrupados
      testimonials: JSON.parse(JSON.stringify(testimonials)), // Aplicar serialización a los testimonios
    },
  };
}
