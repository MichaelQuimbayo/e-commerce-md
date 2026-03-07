// pages/shop.js
import ShopPage from '../src/features/products/presentation/pages/ShopPage';
import { InMemoryProductRepository } from '../src/features/products/infrastructure/repositories/InMemoryProductRepository';
import { GetAllProducts } from '../src/features/products/application/useCases/GetAllProducts';

export default ShopPage;

export async function getServerSideProps() {
  // Para la página de la tienda, necesitamos obtener TODOS los productos.
  const productRepository = new InMemoryProductRepository();
  const getAllProducts = new GetAllProducts(productRepository);
  const products = await getAllProducts.execute();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
