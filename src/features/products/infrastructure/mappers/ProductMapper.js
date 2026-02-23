import { ProductEntity } from '../../domain/entities/ProductEntity.js';

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Maps a raw API material object to a clean ProductEntity.
 * This function makes educated guesses about the structure of the raw API response.
 * You may need to adjust the parsing logic based on the actual API data.
 * @param {object} rawMaterial The raw material object from the parser.
 * @returns {ProductEntity} An instance of the clean ProductEntity.
 */
export const toDomain = (rawMaterial) => {
  // --- ADDED FOR DEBUGGING ---
  console.log('Raw Material in Mapper:', rawMaterial);
  // ---------------------------

  // Basic Fields
  const id = rawMaterial.id;
  // Refined name matching: try 'es-co', then 'es', then first available, then default
  const name = rawMaterial.descriptions?.find(d => d.lang === 'es-co')?.value ||
               rawMaterial.descriptions?.find(d => d.lang === 'es')?.value ||
               rawMaterial.descriptions?.[0]?.value ||
               'Nombre no disponible';
  const description = rawMaterial.descriptions?.find(d => d.lang === 'es-co' && d.value !== name)?.value ||
                      rawMaterial.descriptions?.find(d => d.lang === 'es' && d.value !== name)?.value ||
                      ''; // Assuming product description is also in descriptions array
  const slug = slugify(name);

  // Prices - CORRECTED entity_type
  const priceValue = rawMaterial.values?.find(v => v.entity_type === 'price')?.value || 0; // Corrected: 'selling_price' to 'price'
  const originalPriceValue = rawMaterial.values?.find(v => v.entity_type === 'original_price')?.value; // Optional original price

  // Stock
  const stockFromApi = rawMaterial.values?.find(v => v.entity_type === 'stock')?.value || 5; // Temporarily hardcode stock to 5

  // Determine Product Status based on 'is_product_active' and stock
  const isActiveLabel = rawMaterial.labels?.find(l => l.entity_type === 'is_product_active');
  const isProductActive = isActiveLabel?.value === 'SI';

  let productStatus;
  let finalStock;

  if (!isProductActive) {
      productStatus = 'disabled';
      finalStock = 0; // If disabled, effective stock is 0
  } else {
      // If active, stock from API determines 'available' or 'sold-out'
      if (stockFromApi > 0) {
          productStatus = 'available';
          finalStock = stockFromApi;
      } else {
          productStatus = 'sold-out';
          finalStock = 0; // Out of stock
      }
  }

  // Images and Colors
  let primaryImageUrl = 'https://via.placeholder.com/150';
  const colors = [];
  const sizes = [];

  if (rawMaterial.resources && rawMaterial.resources.length > 0) {
    const firstImageResource = rawMaterial.resources.find(r => r.content_type?.startsWith('image/'));
    if (firstImageResource) {
      primaryImageUrl = firstImageResource.url;
    }

    colors.push({
        name: 'Único',
        colorHex: '#CCCCCC',
        images: rawMaterial.resources
                  .filter(r => r.content_type?.startsWith('image/'))
                  .map(r => r.url) || [primaryImageUrl],
    });
  }

  // Sizes: Placeholder
  sizes.push('S', 'M', 'L', 'XL');

  // Rating and Category
  const rating = rawMaterial.values?.find(v => v.entity_type === 'rating')?.value || 0;
  const category = rawMaterial.labels?.find(l => l.entity_type === 'category')?.value || 'General';


  const mappedProduct = new ProductEntity({
    id: id,
    name: name,
    slug: slug,
    originalPrice: originalPriceValue,
    price: priceValue,
    description: description,
    colors: colors,
    sizes: sizes,
    status: productStatus, // Use the new derived status
    rating: rating,
    category: category,
    imageUrl: primaryImageUrl,
    stock: finalStock, // Use the new derived stock
  });

  // --- ADDED FOR DEBUGGING ---
  console.log('Mapped Product Entity:', mappedProduct);
  // ---------------------------

  return mappedProduct;
};
