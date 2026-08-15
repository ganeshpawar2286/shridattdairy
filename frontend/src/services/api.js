const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const getAdminAuthHeader = () => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('sdkas_admin_pass') || 'admin123';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-admin-token': token
  };
};

export const getCustomerAuthHeader = () => {
  const token = localStorage.getItem('customer_token') || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-customer-token': token
  };
};

// Fallback initial products data in case backend server is unreachable
export const FALLBACK_PRODUCTS = [
  {
    "id": "prod-1",
    "name": "Peda",
    "category": "Sweets",
    "retailPrice": 360,
    "wholesalePrice": 330,
    "unit": "1 kg",
    "image": "/images/peda.svg",
    "description": "Traditional fresh milk sweet made daily from pure condensed milk.",
    "inStock": true,
    "isPlaceholderPrice": false
  },
  {
    "id": "prod-2",
    "name": "Khova",
    "category": "Raw Dairy",
    "retailPrice": 380,
    "wholesalePrice": 350,
    "unit": "1 kg",
    "image": "/images/khova.svg",
    "description": "Pure fresh unsweetened mawa/khova ideal for festive sweets and cooking.",
    "inStock": true,
    "isPlaceholderPrice": false
  },
  {
    "id": "prod-3",
    "name": "Basundi",
    "category": "Sweets",
    "retailPrice": 300,
    "wholesalePrice": 270,
    "unit": "1 kg",
    "image": "/images/basundi.svg",
    "description": "Rich, thickened sweetened milk flavoured with cardamom and dry fruits.",
    "inStock": true,
    "isPlaceholderPrice": false
  },
  {
    "id": "prod-4",
    "name": "Kalakand",
    "category": "Sweets",
    "retailPrice": 300,
    "wholesalePrice": 270,
    "unit": "1 kg",
    "image": "/images/kalakand.svg",
    "description": "Soft, granular milk cake sweet made from fresh paneer and pure milk.",
    "inStock": true,
    "isPlaceholderPrice": false
  },
  {
    "id": "prod-5",
    "name": "Curd (Dahi)",
    "category": "Fresh Dairy",
    "retailPrice": 90,
    "wholesalePrice": 80,
    "unit": "1 kg",
    "image": "/images/curd.svg",
    "description": "Thick, creamy set curd prepared from fresh whole milk.",
    "inStock": true,
    "isPlaceholderPrice": false
  },
  {
    "id": "prod-6",
    "name": "Shrikhand",
    "category": "Sweets",
    "retailPrice": 250,
    "wholesalePrice": 220,
    "unit": "1 kg",
    "image": "/images/shrikhand.svg",
    "description": "Strained yogurt dessert infused with saffron, cardamom, and nuts.",
    "inStock": true,
    "isPlaceholderPrice": true
  },
  {
    "id": "prod-7",
    "name": "Milk Cake",
    "category": "Sweets",
    "retailPrice": 350,
    "wholesalePrice": 320,
    "unit": "1 kg",
    "image": "/images/milk_cake.svg",
    "description": "Classic caramelized dense milk sweet with a rich grainy texture.",
    "inStock": true,
    "isPlaceholderPrice": true
  },
  {
    "id": "prod-8",
    "name": "Milk",
    "category": "Fresh Dairy",
    "retailPrice": 60,
    "wholesalePrice": 52,
    "unit": "1 litre",
    "image": "/images/milk.svg",
    "description": "Farm fresh, pure unadulterated whole milk packed daily.",
    "inStock": true,
    "isPlaceholderPrice": true
  },
  {
    "id": "prod-9",
    "name": "Kunda",
    "category": "Sweets",
    "retailPrice": 350,
    "wholesalePrice": 310,
    "unit": "1 kg",
    "image": "/images/kunda.svg",
    "description": "Belagavi famous traditional milk sweet cooked slow for intense caramel flavor.",
    "inStock": true,
    "isPlaceholderPrice": true
  },
  {
    "id": "prod-10",
    "name": "Ghee",
    "category": "Pure Ghee",
    "retailPrice": 600,
    "wholesalePrice": 550,
    "unit": "1 kg",
    "image": "/images/ghee.svg",
    "description": "100% pure granular aromatic desi cow ghee made by traditional process.",
    "inStock": true,
    "isPlaceholderPrice": true
  },
  {
    "id": "prod-11",
    "name": "Lassi",
    "category": "Beverages",
    "retailPrice": 40,
    "wholesalePrice": 35,
    "unit": "1 glass",
    "image": "/images/lassi.svg",
    "description": "Refreshing churned sweet yogurt drink served chilled with malai top.",
    "inStock": true,
    "isPlaceholderPrice": true
  },
  {
    "id": "prod-12",
    "name": "Paneer",
    "category": "Fresh Dairy",
    "retailPrice": 320,
    "wholesalePrice": 290,
    "unit": "1 kg",
    "image": "/images/paneer.svg",
    "description": "Soft, fresh cottage cheese packed with natural milk proteins.",
    "inStock": true,
    "isPlaceholderPrice": true
  },
  {
    "id": "prod-13",
    "name": "Butter",
    "category": "Fresh Dairy",
    "retailPrice": 450,
    "wholesalePrice": 410,
    "unit": "1 kg",
    "image": "/images/butter.svg",
    "description": "Pure cream churned white/yellow butter rich in natural taste.",
    "inStock": true,
    "isPlaceholderPrice": true
  }
];

// --- AUTHENTICATION API ---

// 1. Customer Signup (Mobile + Password)
export const registerCustomer = async ({ name, mobile, password, address }) => {
  const res = await fetch(`${API_BASE}/customer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, mobile, password, address })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Customer registration failed');
  return data;
};

// 2. Customer Login (Mobile + Password)
export const loginCustomer = async ({ mobile, password }) => {
  const res = await fetch(`${API_BASE}/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Customer login failed');
  return data;
};

// 3. Admin Login (Mobile + Password)
export const loginAdmin = async ({ mobile, password }) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Admin login failed');
  return data;
};

// 4. Change Admin Password
export const changeAdminPassword = async ({ currentPassword, newPassword }) => {
  const res = await fetch(`${API_BASE}/admin/change-password`, {
    method: 'PUT',
    headers: getAdminAuthHeader(),
    body: JSON.stringify({ currentPassword, newPassword })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to change admin password');
  return data;
};

// 5. Update Customer Profile
export const updateCustomerProfile = async ({ name, address }) => {
  const res = await fetch(`${API_BASE}/customer/profile`, {
    method: 'PUT',
    headers: getCustomerAuthHeader(),
    body: JSON.stringify({ name, address })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

// 6. Fetch Customer Orders
export const fetchCustomerOrders = async ({ phone, userId }) => {
  const query = new URLSearchParams();
  if (phone) query.append('mobile', phone);
  if (userId) query.append('userId', userId);

  const res = await fetch(`${API_BASE}/customer/orders?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch your orders');
  return res.json();
};

// --- PRODUCTS API ---

export const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Backend response not OK');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return FALLBACK_PRODUCTS;
  } catch (err) {
    console.warn('Backend API unreachable, using fallback product catalog:', err);
    return FALLBACK_PRODUCTS;
  }
};

export const createProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: getAdminAuthHeader(),
    body: JSON.stringify(productData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create product');
  return data;
};

export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeader(),
    body: JSON.stringify(productData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update product');
  return data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeader()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete product');
  return data;
};

export const uploadProductImage = async (formData) => {
  const token = localStorage.getItem('admin_token') || 'admin123';
  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-admin-token': token
    },
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to upload image');
  return data;
};

// --- ORDERS API ---

export const placeOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to place order');
  return data;
};

export const fetchOrders = async () => {
  const res = await fetch(`${API_BASE}/admin/orders`, {
    headers: getAdminAuthHeader()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    method: 'PUT',
    headers: getAdminAuthHeader(),
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update order status');
  return data;
};

// --- CONTACT FORM API ---

export const sendContactMessage = async (contactData) => {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  } catch (err) {
    return { success: true, message: 'Thank you! Your message has been received.' };
  }
};

export const fetchContactMessages = async () => {
  const res = await fetch(`${API_BASE}/admin/contacts`, {
    headers: getAdminAuthHeader()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch contact messages');
  return data;
};
