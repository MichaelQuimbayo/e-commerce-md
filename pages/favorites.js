import FavoritesPage from '../src/features/products/presentation/pages/FavoritesPage';
import { InMemoryProductRepository } from '../src/features/products/infrastructure/repositories/InMemoryProductRepository';
import { GetAllProducts } from '../src/features/products/application/useCases/GetAllProducts';

export default FavoritesPage;

export async function getServerSideProps() {
  // En la página de favoritos, necesitamos todos los productos para poder filtrarlos en el cliente.
  const productRepository = new InMemoryProductRepository();
  const getAllProducts = new GetAllProducts(productRepository);
  const products = await getAllProducts.execute();

  return {
    props: {
      products,
    },
  };
}
