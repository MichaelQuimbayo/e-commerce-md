import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class GetProductById {
  constructor(productRepository) {
    if (!(productRepository instanceof IProductRepository)) {
      throw new Error("productRepository debe ser una instancia de IProductRepository.");
    }
    this.productRepository = productRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error("El ID del producto es requerido.");
    }
    return this.productRepository.getProductById(id);
  }
}
