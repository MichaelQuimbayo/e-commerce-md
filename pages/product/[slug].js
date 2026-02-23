import ProductDetailPage from '../../src/features/products/presentation/pages/ProductDetailPage';
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

  // --- MOCK DATA GENERATION ---
  // Since the single product endpoint doesn't exist yet, we create a placeholder product.
  // This allows the detail page to render without errors.
  // Once the endpoint is ready, this block can be replaced with the real API call and mapping.
  const mockProduct = new ProductEntity({
    id: id,
    name: `Producto de Prueba (${slug.split('-').slice(0, -5).join(' ')})`,
    slug: slug,
    price: 99999,
    description: 'Esta es una descripción de prueba para un producto que se cargará desde la API cuando el endpoint esté listo.',
    imageUrl: 'https://via.placeholder.com/400',
    status: 'available',
    stock: 10,
    rating: 4,
    category: 'Pruebas',
    colors: [],
    sizes: ['S', 'M', 'L'],
  });

  // --- TODO: This `allProducts` logic should also be updated to use the real API ---
  const productRepository = new InMemoryProductRepository();
  const getAllProducts = new GetAllProducts(productRepository);
  const allProducts = await getAllProducts.execute();

  return {
    props: {
      // Convert the class instance to a plain object for Next.js serialization
      product: JSON.parse(JSON.stringify(mockProduct)),
      allProducts,
    },
  };
}
