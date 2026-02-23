import useSWR from 'swr';
import { useMemo } from 'react';
import { toMaterial } from '../../domain/entities/Material.es'; // The raw parser for Material
import { toDomain as productMapper } from '../mappers/ProductMapper'; // Our new mapper for ProductEntity

const API_URL = 'https://us-central1-toolx-cloud-pos.cloudfunctions.net/api/v1/workspaces/av_store/materials';

/**
 * Custom hook to fetch product data using SWR.
 * It fetches raw data, parses it, and maps it to clean ProductEntity domain objects.
 * @returns {{products: ProductEntity[] | null, isLoading: boolean, isError: any}}
 */
export const useProducts = () => {
    const { data: rawApiData, error } = useSWR(API_URL);

    const products = useMemo(() => {
        if (!rawApiData) return null;
        try {
            // 1. Parse raw API response using the auto-generated parser
            // Assuming `toMaterial` processes an array of raw material objects.
            const parsedRawMaterials = toMaterial(JSON.stringify(rawApiData));
            
            // Ensure parsedRawMaterials is an array before mapping
            if (!Array.isArray(parsedRawMaterials)) {
                console.error("Error: toMaterial did not return an array.", parsedRawMaterials);
                return []; // Return empty array or throw error
            }

            // 2. Map each parsed raw material into a clean ProductEntity
            return parsedRawMaterials.map(productMapper);

        } catch (e) {
            console.error("Error parsing or mapping product data:", e);
            return null;
        }
    }, [rawApiData]);

    return {
        products: products,
        isLoading: !error && !rawApiData,
        isError: error
    };
};
