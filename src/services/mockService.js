// Mock Service for Mie Ayam Baso Tuyem
// Simulates Supabase (database, real-time) and Firebase (authentication) using localStorage.

const DEFAULT_MENU = [
  {
    id: 'menu-1',
    name: 'Mie Ayam Biasa',
    description: 'Mie ayam gurih dengan potongan ayam kecap melimpah, daun bawang segar, dan kuah kaldu hangat.',
    price: 15000,
    category: 'makanan',
    status: 'tersedia',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'menu-2',
    name: 'Mie Ayam Baso',
    description: 'Mie ayam biasa ditambah 2 biji baso daging sapi yang kenyal dan lezat.',
    price: 19000,
    category: 'makanan',
    status: 'tersedia',
    image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'menu-3',
    name: 'Mie Ayam Pangsit',
    description: 'Mie ayam biasa dilengkapi dengan 2 pangsit rebus lembut dan taburan pangsit goreng renyah.',
    price: 18000,
    category: 'makanan',
    status: 'tersedia',
    image_url: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'menu-4',
    name: 'Bakso Kuah Sapi',
    description: 'Satu porsi bakso kuah hangat berisi 1 bakso urat besar dan 4 bakso halus dilengkapi sayuran dan mie/bihun.',
    price: 15000,
    category: 'makanan',
    status: 'tersedia',
    image_url: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'menu-5',
    name: 'Ekstra Pangsit Basah (2 pcs)',
    description: 'Tambahan pangsit basah isi ayam giling bumbu yang gurih.',
    price: 3000,
    category: 'ekstra',
    status: 'tersedia',
    image_url: ''
  },
  {
    id: 'menu-6',
    name: 'Ekstra Ceker Ayam (3 pcs)',
    description: 'Ceker ayam bumbu kecap manis gurih empuk lunak.',
    price: 3000,
    category: 'ekstra',
    status: 'tersedia',
    image_url: ''
  },
  {
    id: 'menu-7',
    name: 'Es Teh Manis / Hangat',
    description: 'Teh harum melati manis segar.',
    price: 4000,
    category: 'minuman',
    status: 'tersedia',
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'menu-8',
    name: 'Es Jeruk Peras',
    description: 'Jeruk peras murni segar kaya vitamin C.',
    price: 5000,
    category: 'minuman',
    status: 'tersedia',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
  }
];

const DEFAULT_TABLES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// Initialize storage
if (!localStorage.getItem('tuyem_menu')) {
  localStorage.setItem('tuyem_menu', JSON.stringify(DEFAULT_MENU));
}
if (!localStorage.getItem('tuyem_tables')) {
  localStorage.setItem('tuyem_tables', JSON.stringify(DEFAULT_TABLES));
}
if (!localStorage.getItem('tuyem_orders')) {
  localStorage.setItem('tuyem_orders', JSON.stringify([]));
}

// Callbacks for real-time simulation
let orderSubscribers = [];

const notifyOrderSubscribers = () => {
  const orders = mockGetOrders();
  orderSubscribers.forEach(cb => cb(orders));
};

export const mockGetMenuItems = () => {
  return JSON.parse(localStorage.getItem('tuyem_menu'));
};

export const mockSaveMenuItem = (item) => {
  const menu = mockGetMenuItems();
  if (item.id) {
    const index = menu.findIndex(m => m.id === item.id);
    if (index !== -1) {
      menu[index] = { ...menu[index], ...item };
    }
  } else {
    const newItem = {
      ...item,
      id: 'menu-' + Date.now(),
      image_url: item.image_url || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
    };
    menu.push(newItem);
  }
  localStorage.setItem('tuyem_menu', JSON.stringify(menu));
  return menu;
};

export const mockDeleteMenuItem = (id) => {
  const menu = mockGetMenuItems();
  const filtered = menu.filter(m => m.id !== id);
  localStorage.setItem('tuyem_menu', JSON.stringify(filtered));
  return filtered;
};

export const mockGetTables = () => {
  return JSON.parse(localStorage.getItem('tuyem_tables'));
};

export const mockSaveTable = (tableNum) => {
  const tables = mockGetTables();
  if (!tables.includes(tableNum)) {
    tables.push(tableNum);
    tables.sort((a, b) => parseInt(a) - parseInt(b));
    localStorage.setItem('tuyem_tables', JSON.stringify(tables));
  }
  return tables;
};

export const mockDeleteTable = (tableNum) => {
  const tables = mockGetTables();
  const filtered = tables.filter(t => t !== tableNum);
  localStorage.setItem('tuyem_tables', JSON.stringify(filtered));
  return filtered;
};

export const mockGetOrders = () => {
  return JSON.parse(localStorage.getItem('tuyem_orders')) || [];
};

export const mockCreateOrder = (orderData, items) => {
  const orders = mockGetOrders();
  const newOrder = {
    id: 'TYM-' + Date.now().toString().slice(-6),
    customer_name: orderData.customerName,
    customer_phone: orderData.customerPhone || '',
    fulfillment_type: orderData.fulfillmentType,
    table_number: orderData.fulfillmentType === 'dine_in' ? orderData.tableNumber : null,
    pickup_time: orderData.fulfillmentType === 'take_away' ? orderData.pickupTime : (orderData.fulfillmentType === 'dine_in' ? orderData.estimatedArrival : null),
    delivery_address: orderData.fulfillmentType === 'delivery' ? orderData.deliveryAddress : null,
    payment_method: orderData.paymentMethod,
    total_price: orderData.totalPrice,
    status: 'pending',
    created_at: new Date().toISOString(),
    items: items.map(i => ({
      id: 'item-' + Math.random().toString(36).substr(2, 9),
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      notes: i.notes || ''
    }))
  };
  
  orders.unshift(newOrder); // Newest first
  localStorage.setItem('tuyem_orders', JSON.stringify(orders));
  notifyOrderSubscribers();
  return newOrder;
};

export const mockUpdateOrderStatus = (orderId, status) => {
  const orders = mockGetOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem('tuyem_orders', JSON.stringify(orders));
    notifyOrderSubscribers();
    return orders[index];
  }
  return null;
};

export const mockSubscribeOrders = (callback) => {
  orderSubscribers.push(callback);
  // Send current orders right away
  callback(mockGetOrders());
  
  return {
    unsubscribe: () => {
      orderSubscribers = orderSubscribers.filter(cb => cb !== callback);
    }
  };
};

// Admin auth simulation
export const mockLoginAdmin = (email, password) => {
  if (email === 'admin@tuyem.com' && password === 'admin123') {
    const adminSession = { email, token: 'mock-jwt-token-' + Date.now() };
    sessionStorage.setItem('tuyem_admin_session', JSON.stringify(adminSession));
    return adminSession;
  }
  throw new Error('Email atau password admin salah!');
};

export const mockLogoutAdmin = () => {
  sessionStorage.removeItem('tuyem_admin_session');
};

export const mockGetCurrentAdmin = () => {
  const session = sessionStorage.getItem('tuyem_admin_session');
  return session ? JSON.parse(session) : null;
};
