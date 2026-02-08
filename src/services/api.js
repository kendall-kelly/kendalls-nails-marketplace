const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Build URL for uploaded image
 * @param {string} imagePath - The image filename from the order's image_path field
 * @returns {string} The full URL to access the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

/**
 * Check if the current user exists in the Kendall's Nails API
 * @param {string} accessToken - Auth0 access token with audience https://nails-api.kendall-kelly.com/
 * @returns {Promise<{exists: boolean, user?: object}>}
 */
export const checkUserExists = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const user = await response.json();
      return { exists: true, user };
    }

    if (response.status === 404) {
      return { exists: false };
    }

    // Handle other error statuses
    throw new Error(`Failed to check user: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};

/**
 * Create a new user in the Kendall's Nails API
 * User information is extracted from the JWT and Auth0's /userinfo endpoint
 * @param {string} accessToken - Auth0 access token with audience https://nails-api.kendall-kelly.com/
 * @returns {Promise<object>} The created user object
 */
export const createUser = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status} ${response.statusText}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Ensures a user exists in the Kendall's Nails API
 * Checks if user exists, creates if needed
 * @param {string} accessToken - Auth0 access token with audience https://nails-api.kendall-kelly.com/
 * @returns {Promise<object>} The user object
 */
export const ensureUserExists = async (accessToken) => {
  const { exists, user } = await checkUserExists(accessToken);

  if (exists) {
    return user;
  }

  // User doesn't exist, create them
  return await createUser(accessToken);
};

/**
 * Get orders for the current user
 * @param {string} accessToken - Auth0 access token with audience https://nails-api.kendall-kelly.com/
 * @param {object} params - Query parameters (page, limit)
 * @returns {Promise<{data: Array, pagination: object}>} Orders and pagination info
 */
export const getOrders = async (accessToken, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `${API_BASE_URL}/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to fetch orders: ${response.status}`);
    }

    const result = await response.json();
    return {
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Create a new order
 * @param {string} accessToken - Auth0 access token with audience https://nails-api.kendall-kelly.com/
 * @param {object} orderData - Order data with description, quantity, and optional image (File)
 * @returns {Promise<object>} The created order object
 */
export const createOrder = async (accessToken, orderData) => {
  try {
    let body;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // If image is provided, use FormData; otherwise use JSON
    if (orderData.image) {
      const formData = new FormData();
      formData.append('description', orderData.description);
      formData.append('quantity', orderData.quantity.toString());
      formData.append('image', orderData.image);
      body = formData;
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({
        description: orderData.description,
        quantity: orderData.quantity,
      });
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to create order: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get messages for an order
 * @param {string} accessToken - Auth0 access token with audience https://nails-api.kendall-kelly.com/
 * @param {number} orderId - The order ID to get messages for
 * @returns {Promise<Array>} Array of message objects
 */
export const getMessages = async (accessToken, orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/messages`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to fetch messages: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a message on an order
 * @param {string} accessToken - Auth0 access token with audience https://nails-api.kendall-kelly.com/
 * @param {number} orderId - The order ID to send the message to
 * @param {string} text - The message text
 * @returns {Promise<object>} The created message object
 */
export const sendMessage = async (accessToken, orderId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to send message: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
