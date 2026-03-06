import { ProductEntity } from '../../domain/entities/ProductEntity.js';

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\\w\\-]+/g, '')       // Remove all non-word chars
    .replace(/\\-\\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Maps a raw API material object to a clean ProductEntity.
 * @param {object} rawMaterial The raw material object from the API.
 * @returns {ProductEntity} An instance of the clean ProductEntity.
 */
export const toDomain = (rawMaterial) => {
  const id = rawMaterial.id;

  // --- Robust Name Extraction ---
  // Ensure descriptions is an array before trying to process it.
  // Fallback to a top-level `name` property if descriptions are missing.
  const name = (Array.isArray(rawMaterial.descriptions) && rawMaterial.descriptions.find(d => d.lang === 'es-co')?.value) ||
               (Array.isArray(rawMaterial.descriptions) && rawMaterial.descriptions[0]?.value) ||
               rawMaterial.name || // Fallback for items that might have a direct name property
               'Producto sin Nombre'; // Final fallback

  // Description from features array
  const description = rawMaterial.features?.find(f => f.entity_type === 'description')?.value || 
                      'Descripción no disponible';

  const slug = slugify(name);

  // Price from values
  const priceValue = rawMaterial.values?.find(v => v.entity_type === 'price')?.value || 0;
  const originalPriceValue = rawMaterial.values?.find(v => v.entity_type === 'original_price')?.value || null;

  // Stock from values
  const stockValue = rawMaterial.values?.find(v => v.entity_type === 'inventory')?.value || 0;

  // Status from labels and stock
  const isActiveLabel = rawMaterial.labels?.find(l => l.entity_type === 'is_product_active');
  const isProductActive = isActiveLabel?.value === 'SI';
  const status = isProductActive && stockValue > 0 ? 'available' : 'sold-out';

  // Rating and category are not consistently present in sample, defaulting
  const rating = rawMaterial.values?.find(v => v.entity_type === 'rating')?.value || 0;
  const category = rawMaterial.labels?.find(l => l.entity_type === 'category')?.value || 'General';

  // imageUrl will be a placeholder, primaryImage getter in ProductEntity will handle resources
  const imageUrl = 'https://via.placeholder.com/150';

  return new ProductEntity({
    id: id,
    name: name,
    slug: slug,
    originalPrice: originalPriceValue,
    price: priceValue,
    description: description,
    status: status,
    rating: rating,
    category: category,
    imageUrl: imageUrl,
    stock: stockValue,
    codes: rawMaterial.codes,       // Pass raw codes
    features: rawMaterial.features, // Pass raw features
    resources: rawMaterial.resources, // Pass raw resources
  });
};
