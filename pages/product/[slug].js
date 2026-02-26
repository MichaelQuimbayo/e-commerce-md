import ProductDetailPage from '../../src/features/products/presentation/pages/ProductDetailPage';
import { GetProductById } from '../../src/features/products/application/useCases/GetProductById';
import { ProductEntity } from '../../src/features/products/domain/entities/ProductEntity';

// TODO: This should be updated to fetch all products from the real API for the related products section
import { InMemoryProductRepository } from '../../src/features/products/infrastructure/repositories/InMemoryProductRepository';
import { GetAllProducts } from '../../src/features/products/application/useCases/GetAllProducts';

export default ProductDetailPage;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const id = slug.slice(-36);

  if (!id) {
    return { notFound: true };
  }

  const productRepository = new InMemoryProductRepository();
  const getProductById = new GetProductById(productRepository);
  const product = await getProductById.execute(id);


  const getAllProducts = new GetAllProducts(productRepository);
  const allProducts = await getAllProducts.execute();

  return {
    props: {
      // Convert the class instance to a plain object for Next.js serialization
      product: JSON.parse(JSON.stringify(product)),
      allProducts,
    },
  };
}
