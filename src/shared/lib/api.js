const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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

    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.message || 'No se pudo procesar el pedido. Por favor, intente de nuevo.');
    }

    return response.json();
};