import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { products } from '../data/products';

export class InMemoryProductRepository extends IProductRepository {
  constructor() {
    super();
    this.products = products;
  }

  async getAllProducts() {
    return Promise.resolve(this.products);
  }

  async getProductById(id) {
    const product = this.products.find(p => p.id === parseInt(id));
    return Promise.resolve(product || null);
  }

  async getProductBySlug(slug) {
    const product = this.products.find(p => p.slug === slug);
    return Promise.resolve(product || null);
  }

  async getProductsByCategory(categorySlug) {
    const filteredProducts = this.products.filter(p => p.category === categorySlug || p.category === 'unisex');
    return Promise.resolve(filteredProducts);
  }
}
