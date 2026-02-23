/**
 * Represents a clean Product entity for use within the application domain.
 * This class normalizes the data structure from various sources and
 * includes all relevant product details.
 */
export class ProductEntity {
  constructor({
    id,
    name,
    slug,
    originalPrice,
    price,
    description,
    colors, // Array of { name, colorHex, images }
    sizes,  // Array of strings
    status, // e.g., 'available', 'sold-out'
    rating, // number
    category, // string
    imageUrl, // Primary image URL for the card
    stock,
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.originalPrice = originalPrice;
    this.price = price;
    this.description = description;
    this.colors = colors || [];
    this.sizes = sizes || [];
    this.status = status;
    this.rating = rating;
    this.category = category;
    this.imageUrl = imageUrl;
    this.stock = stock ;
  }

  /**
   * A getter to format the price for display.
   * @returns {string}
   */
  get displayPrice() {
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(this.price || 0).replace(/\s/g, '');
  }

  /**
   * A getter to format the original price for display, if available.
   * @returns {string | null}
   */
  get displayOriginalPrice() {
    return this.originalPrice ? `$${(this.originalPrice || 0).toFixed(2)}` : null;
  }

  /**
   * Checks if the product is currently available for purchase.
   * @returns {boolean}
   */
  isAvailable() {
    return this.status === 'available' && this.stock > 0;
  }

  /**
   * Gets the primary image URL for the product.
   * Prefers the first image of the first color, then imageUrl.
   * @returns {string}
   */
  get primaryImage() {
    if (this.colors && this.colors.length > 0 && this.colors[0].images && this.colors[0].images.length > 0) {
      return this.colors[0].images[0];
    }
    return this.imageUrl;
  }

  /**
   * Gets the product's slug for URL generation.
   * @returns {string}
   */
  get productSlug() {
    return this.slug || this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }
}
