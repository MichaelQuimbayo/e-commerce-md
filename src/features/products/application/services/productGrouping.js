/**
 * @typedef {import('../../domain/entities/ProductEntity').ProductEntity} ProductEntity
 */

/**
 * Represents a product group with its variants and shared information.
 * @typedef {object} GroupedProduct
 * @property {string} groupCode - The code that groups the variants.
 * @property {string} name - The common name for the group.
 * @property {string | null} mainImage - The primary image for the group.
 * @property {ProductEntity[]} variants - An array of all original product entities in the group.
 * @property {{min: number, max: number}} priceRange - The min and max price found in the group.
 */

const GROUP_CODE_TYPE = 'group_code';

/**
 * Processes a flat list of materials to group them by their 'group_code'.
 * Materials without a 'group_code' are treated as individual groups.
 *
 * @param {ProductEntity[]} materials - A flat array of product entities.
 * @returns {GroupedProduct[]}
 */
export const groupProducts = (materials) => {
  if (!materials || materials.length === 0) {
    return [];
  }

  const groups = new Map();

  for (const material of materials) {
    const groupCode = material.codes?.find(
      (c) => c.code_type_lbl === GROUP_CODE_TYPE
    )?.code;

    const key = groupCode ?? `single_${material.id}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(material);
  }

  return Array.from(groups.entries()).map(([groupCode, variants]) => {
    const firstVariant = variants[0];

    const name = firstVariant.name || 'Nombre no disponible';
    const mainImage = firstVariant.primaryImage || null;

    const prices = variants.map(v => v.price).filter(p => p != null);
    
    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
    };

    return {
      groupCode,
      name,
      mainImage,
      variants,
      priceRange,
    };
  });
};
