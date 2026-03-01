import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class GetProductBySlug {
  constructor(productRepository) {
    if (!(productRepository instanceof IProductRepository)) {
      throw new Error("productRepository debe ser una instancia de IProductRepository.");
    }
    this.productRepository = productRepository;
  }

  async execute(slug) {
    if (!slug) {
      throw new Error("El slug del producto es requerido.");
    }
    return this.productRepository.getProductBySlug(slug);
  }
}
