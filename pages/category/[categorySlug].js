import CategoryPage from '../../src/features/products/presentation/pages/CategoryPage';
import { InMemoryProductRepository } from '../../src/features/products/infrastructure/repositories/InMemoryProductRepository';
import { GetProductsByCategory } from '../../src/features/products/application/useCases/GetProductsByCategory';

export default CategoryPage;

export async function getServerSideProps(context) {
  const { categorySlug } = context.params;

  const productRepository = new InMemoryProductRepository();
  const getProductsByCategory = new GetProductsByCategory(productRepository);
  const products = await getProductsByCategory.execute(categorySlug);

  // Pasamos tanto los productos filtrados como el nombre de la categoría a la página.
  return {
    props: {
      products,
      categoryName: categorySlug,
    },
  };
}
