import ProductDetailPage from '../../src/features/products/presentation/pages/ProductDetailPage';
import { GetProductById } from '../../src/features/products/application/useCases/GetProductById';
import { InMemoryProductRepository } from '../../src/features/products/infrastructure/repositories/InMemoryProductRepository';
// We no longer need GetAllProducts directly here, as getProductsByGroup handles getting all variants.

export default ProductDetailPage;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const currentVariantId = slug.slice(-36); // Assuming the ID is always the last 36 chars of the slug

  if (!currentVariantId) {
    return { notFound: true };
  }

  const productRepository = new InMemoryProductRepository();
  const getProductById = new GetProductById(productRepository);
  
  // 1. Get the specific variant the user navigated to
  const currentVariant = await getProductById.execute(currentVariantId);

  if (!currentVariant) {
    return { notFound: true };
  }

  // 2. Extract its group code (if it has one)
  const groupCode = currentVariant.codes?.find(c => c.code_type_lbl === 'group_code')?.code;

  let productGroup;
  if (groupCode) {
    // 3. Get all variants belonging to this group
    // The getProductsByGroup returns an array of ProductEntity
    productGroup = await productRepository.getProductsByGroup(groupCode);
  } else {
    // 4. If no group code, treat this single variant as its own group
    productGroup = [currentVariant];
  }

  // Optional: Fetch related products. For now, we'll keep it simple and pass an empty array,
  // or use a separate API call if performance is an issue.
  // const getAllProductsUseCase = new GetAllProducts(productRepository);
  // const allGroupedProducts = await getAllProductsUseCase.execute(); 
  // For now, related products will be handled by the client if needed or a separate component.

  return {
    props: {
      // All props must be JSON serializable
      productGroup: JSON.parse(JSON.stringify(productGroup)),
      currentVariantId: JSON.parse(JSON.stringify(currentVariantId)),
      // relatedProducts: JSON.parse(JSON.stringify(allGroupedProducts)), // If you want to fetch related
    },
  };
}
