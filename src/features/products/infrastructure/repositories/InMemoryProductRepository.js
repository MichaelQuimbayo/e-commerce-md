import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { products } from '../data/products';
import { toDomain } from '../mappers/ProductMapper';

export class InMemoryProductRepository extends IProductRepository {
  constructor() {
    super();
    this.products = products;
  }

  async getAllProducts() {
    return Promise.resolve(this.products);
  }

  async getProductById(id) {
    try {
      const response = await fetch(`https://us-central1-toolx-cloud-pos.cloudfunctions.net/api/v1/workspaces/av_store/materials/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the API response structure matches ProductEntity constructor
      // If not, a mapping function will be needed here, e.g., ProductMapper.fromApi(data)
      return toDomain(data);
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
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
