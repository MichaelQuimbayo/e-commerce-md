import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { toDomain } from '../mappers/ProductMapper';
import { groupProducts } from '../../application/services/productGrouping';

const API_URL = 'https://us-central1-toolx-cloud-pos.cloudfunctions.net/api/v1/workspaces/av_store/materials';

export class InMemoryProductRepository extends IProductRepository {
  constructor() {
    super();
    this.groupedProducts = null; // Cache for grouped products
  }

  async getAllProducts() {
    // Return from cache if available
    if (this.groupedProducts) {
      return this.groupedProducts;
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawMaterials = await response.json();

      const productEntities = rawMaterials.map(material => toDomain(material));
      
      const grouped = groupProducts(productEntities);

      this.groupedProducts = grouped; // Cache the result
      return grouped;

    } catch (error) {
      console.error("Error fetching or grouping products:", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawMaterial = await response.json();
      return toDomain(rawMaterial);
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  }

  async getProductsByGroup(groupCode) {
    if (!groupCode) return [];
    
    const allGroupedProducts = await this.getAllProducts();
    
    const foundGroup = allGroupedProducts.find(g => g.groupCode === groupCode);
    
    return foundGroup ? foundGroup.variants : [];
  }


  // TODO: These methods need proper implementation for the new grouped structure.
  async getProductBySlug(slug) {
    console.warn('getProductBySlug is not optimized for the new grouped structure.');
    return null;
  }

  async getProductsByCategory(categorySlug) {
    console.warn('getProductsByCategory is not optimized for the new grouped structure.');
    return [];
  }
}
