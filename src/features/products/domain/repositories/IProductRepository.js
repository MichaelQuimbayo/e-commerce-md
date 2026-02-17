// Puerto: Define el contrato que cualquier repositorio de productos debe cumplir.
export class IProductRepository {
  async getAllProducts() {
    throw new Error("Método 'getAllProducts()' no implementado.");
  }

  async getProductById(id) {
    throw new Error("Método 'getProductById(id)' no implementado.");
  }

  async getProductBySlug(slug) {
    throw new Error("Método 'getProductBySlug(slug)' no implementado.");
  }

  async getProductsByCategory(categorySlug) {
    throw new Error("Método 'getProductsByCategory(categorySlug)' no implementado.");
  }
}
