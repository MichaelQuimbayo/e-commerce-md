/**
 * Represents a clean Product entity for use within the application domain.
 * This class normalizes the data structure from various sources and
 * includes all relevant product details, adapted for grouped products.
 */
export class ProductEntity {
  constructor({
    id,
    name,
    slug,
    originalPrice,
    price,
    description,
    status, // e.g., 'available', 'sold-out'
    rating, // number
    category, // string
    imageUrl, // Primary image URL for the card (can be derived from resources)
    stock, // numerical stock for this specific variant
    codes, // Array of raw codes from API
    features, // Array of raw features (e.g., color, size) from API
    resources, // Array of raw resources (e.g., images) from API
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.originalPrice = originalPrice;
    this.price = price;
    this.description = description;
    this.status = status;
    this.rating = rating;
    this.category = category;
    this.imageUrl = imageUrl; // Can be a fallback or direct from mapper
    this.stock = stock;
    this.codes = codes || []; // Store raw codes
    this.features = features || []; // Store raw features
    this.resources = resources || []; // Store raw resources
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
   * Gets the primary image URL for the product, derived from resources.
   * @returns {string | null}
   */
  get primaryImage() {
    const primaryResource = this.resources.find(r => r.content_type?.startsWith('image/'));
    return primaryResource?.url || this.imageUrl || null;
  }

  /**
   * Gets the product's slug for URL generation.
   * @returns {string}
   */
  get productSlug() {
    // If slug is explicitly provided, use it. Otherwise, generate from name.
    return this.slug || this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\\w\\-]+/g, '');
  }

  /**
   * Gets the color of this specific product variant.
   * @returns {string | null}
   */
  get color() {
    const colorFeature = this.features.find(f => f.entity_type === 'color');
    return colorFeature?.value || null;
  }

  /**
   * Gets the size of this specific product variant.
   * @returns {string | null}
   */
  get size() {
    const sizeFeature = this.features.find(f => f.entity_type === 'size');
    return sizeFeature?.value || null;
  }
}
