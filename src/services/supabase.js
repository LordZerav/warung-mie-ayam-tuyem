import { createClient } from '@supabase/supabase-js';
import * as mockService from './mockService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
// Gunakan admin secret dari env, atau fallback ke key default agar tidak crash
const adminSecret = import.meta.env.VITE_ADMIN_SECRET || 'tuyem_admin_secret_key_123';

// Check if credentials are provided
const isRealSupabase = !!(supabaseUrl && supabaseAnonKey);

// Client biasa untuk customer (hanya membaca menu, mengirim order)
export const supabase = isRealSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Client khusus admin dengan header otorisasi RLS tambahan
export const supabaseAdmin = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'x-admin-secret': adminSecret
        }
      }
    })
  : null;

// Wrappers that auto-fallback to mock if real credentials are not present
export const getMenuItems = async () => {
  if (isRealSupabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockGetMenuItems();
    }
  }
  return mockService.mockGetMenuItems();
};

export const saveMenuItem = async (item) => {
  if (isRealSupabase) {
    try {
      if (item.id && !item.id.toString().startsWith('menu-')) {
        const { data, error } = await supabaseAdmin
          .from('menu_items')
          .update(item)
          .eq('id', item.id)
          .select();
        if (error) throw error;
        return data;
      } else {
        // Remove temp mock ID or null ID if present
        const dbItem = { ...item };
        if (dbItem.id === null || dbItem.id === undefined || dbItem.id.toString().startsWith('menu-')) {
          delete dbItem.id;
        }
        const { data, error } = await supabaseAdmin
          .from('menu_items')
          .insert([dbItem])
          .select();
        if (error) throw error;
        return data;
      }
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockSaveMenuItem(item);
    }
  }
  return mockService.mockSaveMenuItem(item);
};

export const deleteMenuItem = async (id) => {
  if (isRealSupabase) {
    try {
      const { error } = await supabaseAdmin
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockDeleteMenuItem(id);
    }
  }
  return mockService.mockDeleteMenuItem(id);
};

export const getTables = async () => {
  if (isRealSupabase) {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('table_number')
        .eq('is_active', true)
        .order('table_number');
      if (error) throw error;
      return data.map(t => t.table_number);
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockGetTables();
    }
  }
  return mockService.mockGetTables();
};

export const saveTable = async (tableNum) => {
  if (isRealSupabase) {
    try {
      const { data, error } = await supabaseAdmin
        .from('tables')
        .upsert([{ table_number: tableNum, is_active: true }])
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockSaveTable(tableNum);
    }
  }
  return mockService.mockSaveTable(tableNum);
};

export const deleteTable = async (tableNum) => {
  if (isRealSupabase) {
    try {
      const { error } = await supabaseAdmin
        .from('tables')
        .update({ is_active: false })
        .eq('table_number', tableNum);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockDeleteTable(tableNum);
    }
  }
  return mockService.mockDeleteTable(tableNum);
};

export const createOrder = async (orderData, items) => {
  if (isRealSupabase) {
    try {
      const orderId = 'TYM-' + Date.now().toString().slice(-6);
      
      // Create main order with estimated arrival for dine-in
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          id: orderId,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone || '',
          fulfillment_type: orderData.fulfillmentType,
          table_number: orderData.fulfillmentType === 'dine_in' ? orderData.tableNumber : null,
          pickup_time: orderData.fulfillmentType === 'take_away' ? orderData.pickupTime : (orderData.fulfillmentType === 'dine_in' ? orderData.estimatedArrival : null),
          delivery_address: orderData.fulfillmentType === 'delivery' ? orderData.deliveryAddress : null,
          payment_method: orderData.paymentMethod,
          total_price: orderData.totalPrice,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (orderErr) throw orderErr;

      // Create order items
      const dbItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id.toString().startsWith('menu-') ? null : item.id, // null for mock menu items
        menu_item_name: item.name, // Denormalized for flexibility
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || ''
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(dbItems);

      if (itemsErr) throw itemsErr;

      return {
        ...order,
        items: dbItems
      };
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockCreateOrder(orderData, items);
    }
  }
  return mockService.mockCreateOrder(orderData, items);
};

export const updateOrderStatus = async (orderId, status) => {
  if (isRealSupabase) {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockUpdateOrderStatus(orderId, status);
    }
  }
  return mockService.mockUpdateOrderStatus(orderId, status);
};

// Update table status (available/occupied)
export const updateTableStatus = async (tableNum, newStatus) => {
  if (isRealSupabase) {
    try {
      const { data, error } = await supabaseAdmin
        .from('tables')
        .update({ status: newStatus })
        .eq('table_number', tableNum)
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase error, falling back to mock:', err);
      return mockService.mockUpdateTableStatus(tableNum, newStatus);
    }
  }
  return mockService.mockUpdateTableStatus(tableNum, newStatus);
};

// Upload menu image to Supabase Storage
export const uploadMenuImage = async (file) => {
  if (!isRealSupabase) {
    throw new Error('Supabase Storage not available in mock mode');
  }
  const ext = file.name.split('.').pop();
  const fileName = `menu-${Date.now()}.${ext}`;
  
  const { data, error } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file, { upsert: false });
  
  if (error) throw error;
  
  const { data: urlData } = supabase.storage
    .from('menu-images')
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
};

// Real-time subscription helper
export const subscribeOrders = (onUpdate) => {
  if (isRealSupabase) {
    // Standard Supabase realtime subscription
    const channel = supabaseAdmin
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async () => {
          // Fetch all orders again to supply full data with items
          try {
            const { data, error } = await supabaseAdmin
              .from('orders')
              .select(`
                *,
                items:order_items(*)
              `)
              .order('created_at', { ascending: false });
            if (!error) onUpdate(data);
          } catch (e) {
            console.error(e);
          }
        }
      )
      .subscribe();

    // Initial fetch
    supabaseAdmin
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) onUpdate(data);
      });

    return {
      unsubscribe: () => {
        supabaseAdmin.removeChannel(channel);
      }
    };
  }
  
  return mockService.mockSubscribeOrders(onUpdate);
};
