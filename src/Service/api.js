const API_BASE_URL = 'https://localhost:7190/api';

// --- Auth ---
export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

export const signupUser = async (userData) => {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};

// --- Products ---
export const fetchProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products`);
  return res.json();
};

export const createProduct = async (productData, token) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const addProduct = createProduct;

export const updateProduct = async (id, productData, token) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error(`Failed to update product: ${res.status}`);
  }

  const text = await res.text();

  if (!text) {
    return true;
  }

  return JSON.parse(text);
};

export const deleteProductFromDB = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

// --- Cart ---
export const fetchUserCart = async (userId, token) => {
  const res = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const saveUserCart = async (userId, cartItems, token) => {
  const res = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ items: cartItems }),
  });
  return res.json();
};

// --- Wishlist ---
export const fetchUserWishlist = async (userId, token) => {
  const res = await fetch(`${API_BASE_URL}/wishlist/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const saveUserWishlist = async (userId, wishlistItems, token) => {
  const res = await fetch(`${API_BASE_URL}/wishlist/${userId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ product: wishlistItems }),
  });
  return res.json();
};

// --- Site Configuration / Settings ---
export const saveSiteConfig = async (configData, token) => {
  const res = await fetch(`${API_BASE_URL}/config`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(configData),
  });
  return res.json();
};

export const fetchSiteConfig = async () => {
  const res = await fetch(`${API_BASE_URL}/config`);
  return res.json();
};
// --- Site Content (Hero Section) ---

export const fetchHeroContent = async () => {
  const res = await fetch(`${API_BASE_URL}/SiteContent/hero`);
  return res.json();
};

export const createHeroContent = async (heroData, token) => {
  const res = await fetch(`${API_BASE_URL}/SiteContent/hero`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(heroData),
  });
  return res.json();
};

export const updateHeroContent = async (id, heroData, token) => {
  const res = await fetch(`${API_BASE_URL}/SiteContent/hero/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(heroData),
  });
  return res.json();
};

export const deleteHeroContent = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/SiteContent/hero/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};
// --- Orders ---
export const placeOrderAPI = async (orderData, token) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    throw new Error('Order could not be placed');
  }
  return res.json();
};

export const fetchUserOrders = async (userId, token) => {
  const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};
// --- Orders (admin additions) ---
export const fetchAllOrders = async (token) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const updateOrderStatusAPI = async (orderId, status, token) => {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error('Could not update order status');
  }
  return true;
};
// --- Category Images (homepage category cards) ---
export const fetchCategoryImages = async () => {
  const res = await fetch(`${API_BASE_URL}/categoryimages`);
  if (!res.ok) throw new Error('Could not load category images');
  return res.json();
};

export const saveCategoryImage = async (categoryName, imageUrl, token) => {
  const res = await fetch(`${API_BASE_URL}/categoryimages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ categoryName, imageUrl }),
  });
  if (!res.ok) throw new Error('Could not save category image');
  return res.json();
};
// --- Home Sections (homepage layout manager) ---
export const fetchHomeSections = async () => {
  const res = await fetch(`${API_BASE_URL}/homesections`);
  if (!res.ok) throw new Error('Could not load home sections');
  return res.json();
};

export const createHomeSection = async (sectionData, token) => {
  const res = await fetch(`${API_BASE_URL}/homesections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(sectionData),
  });
  if (!res.ok) throw new Error('Could not create section');
  return res.json();
};

export const updateHomeSection = async (id, sectionData, token) => {
  const res = await fetch(`${API_BASE_URL}/homesections/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(sectionData),
  });
  if (!res.ok) throw new Error('Could not update section');
  return true; // 204 No Content
};

export const deleteHomeSection = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/homesections/${id}`, {
    method: 'DELETE',
    headers: { ...(token && { 'Authorization': `Bearer ${token}` }) },
  });
  if (!res.ok) throw new Error('Could not delete section');
  return true;
};

export const reorderHomeSections = async (order, token) => {
  // order: [{ id, sortOrder }]
  const res = await fetch(`${API_BASE_URL}/homesections/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ order }),
  });
  if (!res.ok) throw new Error('Could not reorder sections');
  return true;
};
