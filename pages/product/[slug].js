import ProductDetailPage from '../../src/features/products/presentation/pages/ProductDetailPage';
import { GetProductById } from '../../src/features/products/application/useCases/GetProductById';
import { GetAllProducts } from '../../src/features/products/application/useCases/GetAllProducts';
import { InMemoryProductRepository } from '../../src/features/products/infrastructure/repositories/InMemoryProductRepository';

export default ProductDetailPage;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const currentVariantId = slug.slice(-36); // Assuming the ID is always the last 36 chars of the slug

  if (!currentVariantId) {
    return { notFound: true };
  }

  const productRepository = new InMemoryProductRepository();
  const getProductById = new GetProductById(productRepository);
  
  const currentVariant = await getProductById.execute(currentVariantId);

  if (!currentVariant) {
    return { notFound: true };
  }

  const groupCode = currentVariant.codes?.find(c => c.code_type_lbl === 'group_code')?.code;

  let productGroup;
  if (groupCode) {
    productGroup = await productRepository.getProductsByGroup(groupCode);
  } else {
    productGroup = [currentVariant];
  }

  // --- NEW: Fetch all products and filter for related products ---
  const getAllProductsUseCase = new GetAllProducts(productRepository);
  const allGroupedProducts = await getAllProductsUseCase.execute();
  
  // Exclude the current product's group from the related products list
  const relatedProducts = allGroupedProducts.filter(p => p.groupCode !== groupCode);

  return {
    props: {
      productGroup: JSON.parse(JSON.stringify(productGroup)),
      currentVariantId: JSON.parse(JSON.stringify(currentVariantId)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts.slice(0, 8))), // Pass first 8 related products
    },
  };
}
