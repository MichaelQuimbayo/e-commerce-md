import useSWR from 'swr';
import { toMaterial } from '../../domain/entities/Material';

const API_URL = 'https://us-central1-toolx-cloud-pos.cloudfunctions.net/api/v1/workspaces/av_store/materials';

/**
 * Custom hook to fetch materials data using SWR.
 * It fetches raw data and parses it using the auto-generated toMaterial function.
 * @returns {{materials: any, isLoading: boolean, isError: any}}
 */
export const useMaterials = () => {
    const { data, error } = useSWR(API_URL);

    if(data) console.log("datos recibidos de la API:", data);

    // The toMaterial function expects a JSON string. The fetcher provides a JS object.
    // We stringify the data before passing it to the parser.
    const materials = data ? toMaterial(JSON.stringify(data)) : null;

    return {
        materials: materials,
        isLoading: !error && !data,
        isError: error
    };
};
