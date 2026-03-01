import { IProductRepository } from '../../domain/repositories/IProductRepository';

export class GetAllProducts {
  constructor(productRepository) {
    if (!(productRepository instanceof IProductRepository)) {
      throw new Error("productRepository debe ser una instancia de IProductRepository.");
    }
    this.productRepository = productRepository;
  }

  async execute() {
    return this.productRepository.getAllProducts();
  }
}
