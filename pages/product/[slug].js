// pages/product/[slug].js
import ProductDetailPage from '../../src/features/products/presentation/pages/ProductDetailPage';
import { InMemoryProductRepository } from '../../src/features/products/infrastructure/repositories/InMemoryProductRepository';
// Ya no necesitamos GetProductBySlug, usaremos GetProductById que es más eficiente
import { GetProductById } from '../../src/features/products/application/useCases/GetProductById';
import { GetAllProducts } from '../../src/features/products/application/useCases/GetAllProducts';

export default ProductDetailPage;

export async function getServerSideProps(context) {
  const { slug } = context.params; // slug será, por ej: "camiseta-seleccion-colombia-2024-1"
  
  // --- LÓGICA DE EXTRACCIÓN DEL ID ---
  const id = slug.split('-').pop();

  // Si el ID no es un número válido, la URL es incorrecta.
  if (isNaN(id)) {
    return { notFound: true };
  }

  const productRepository = new InMemoryProductRepository();
  const getProductById = new GetProductById(productRepository); // <-- Usamos GetProductById
  const getAllProducts = new GetAllProducts(productRepository);

  const product = await getProductById.execute(id); // <-- Buscamos por ID
  const allProducts = await getAllProducts.execute();

  // Redirección SEO: Si el slug de la URL no coincide con el slug del producto encontrado,
  // hacemos una redirección 301 a la URL correcta.
  if (product && slug !== `${product.slug}-${product.id}`) {
    return {
      redirect: {
        destination: `/product/${product.slug}-${product.id}`,
        permanent: true,
      },
    };
  }

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
      allProducts,
    },
  };
}
