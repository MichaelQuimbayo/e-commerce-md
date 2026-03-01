import useSWR from 'swr';
import { useMemo } from 'react';
import { toDomain as productMapper } from '../mappers/ProductMapper';
import { groupProducts } from '../../application/services/productGrouping';

const API_URL = 'https://us-central1-toolx-cloud-pos.cloudfunctions.net/api/v1/workspaces/av_store/materials';

/**
 * Custom hook to fetch, parse, map, and group product data.
 * @returns {{products: import('../../application/services/productGrouping').GroupedProduct[] | null, isLoading: boolean, isError: any}}
 */
export const useProducts = () => {
    const { data: rawApiData, error } = useSWR(API_URL);

    const products = useMemo(() => {
        if (!rawApiData) return null;
        try {
            // As the API response is directly an array of raw materials, we can use it directly.
            // No need for a separate `toMaterial` parsing step if `rawApiData` is already the array.
            const rawMaterials = rawApiData; // Assuming rawApiData is already the array from the API
            
            if (!Array.isArray(rawMaterials)) {
                console.error("Error: API response was not an array.", rawMaterials);
                return [];
            }

            // 1. Map each raw material into a clean ProductEntity using the updated mapper
            const productEntities = rawMaterials.map(productMapper);

            // 2. Group the ProductEntity instances
            return groupProducts(productEntities);

        } catch (e) {
            console.error("Error parsing, mapping, or grouping product data:", e);
            return null;
        }
    }, [rawApiData]);

    return {
        products: products, // This is now an array of GroupedProduct or null
        isLoading: !error && !rawApiData,
        isError: error
    };
};
