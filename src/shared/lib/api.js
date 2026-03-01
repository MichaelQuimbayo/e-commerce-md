const APP_API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const MATERIALS_API_URL = 'https://us-central1-toolx-cloud-pos.cloudfunctions.net/api/v1/workspaces/av_store/materials';

/**
 * A generic fetcher function for use with SWR.
 * It takes a URL, fetches the data, and returns it as JSON.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<any>} The JSON data from the response.
 */
export const fetcher = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        try {
            error.info = await res.json();
        } catch (e) {
            error.info = { status: res.status, statusText: res.statusText };
        }
        error.status = res.status;
        throw error;
    }

    return res.json();
};

/**
 * Fetches a single product by its ID from the materials API.
 * @param {string} id The ID of the product to fetch.
 * @returns {Promise<object | null>} The raw product data from the API, or null if not found.
 */
export const getProductByIdFromApi = async (id) => {
  if (!id) return null;

  try {
    const responseData = await fetcher(`${MATERIALS_API_URL}?id=${id}`);
    
    // If the API unexpectedly returns an array, take the first element.
    if (Array.isArray(responseData) && responseData.length > 0) {
      return responseData[0];
    }
    
    // If the API returns an empty array or something else falsy, treat as not found.
    if (!responseData || (Array.isArray(responseData) && responseData.length === 0)) {
        return null;
    }

    // Otherwise, assume it's the correct single object.
    return responseData;

  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    if (error.status === 404) {
      return null;
    }
    return null;
  }
};

/**
 * Submits the order details to the API.
 * @param {object} orderDetails - The details of the order.
 * @returns {Promise<object>} The response from the API.
 */
export const submitOrder = async (orderDetails) => {
    const formData = new FormData();

    const orderData = {
        shippingInfo: orderDetails.shippingInfo,
        paymentMethod: orderDetails.paymentMethod,
        items: orderDetails.items,
        total: orderDetails.total,
    };
    formData.append('order', JSON.stringify(orderData));

    if (orderDetails.receipt) {
        formData.append('receipt', orderDetails.receipt);
    }

    const response = await fetch(`${APP_API_URL}/orders`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.message || 'No se pudo procesar el pedido. Por favor, intente de nuevo.');
    }

    return response.json();
};