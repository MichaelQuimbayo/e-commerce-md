import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class GetProductsByCategory {
  constructor(productRepository) {
    if (!(productRepository instanceof IProductRepository)) {
      throw new Error("productRepository debe ser una instancia de IProductRepository.");
    }
    this.productRepository = productRepository;
  }

  async execute(categorySlug) {
    if (!categorySlug) {
      throw new Error("El slug de la categoría es requerido.");
    }
    return this.productRepository.getProductsByCategory(categorySlug);
  }
}
