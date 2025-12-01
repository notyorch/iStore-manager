const API_URL = '/api';

export interface Phone {
  id: number;
  modelo: string;
  capacidad: string;
  condicion: string;
  precio: number;
  estado: string;
}

export interface InventoryPriceSegment {
  label: string;
  from: number;
  to: number | null;
  count: number;
}

export interface InventoryTopModel {
  modelo: string;
  cantidad: number;
}

export interface SalesTopModel {
  modelo: string;
  cantidad: number;
  ingresos: number;
}

export interface DashboardStats {
  inventory: {
    total: number;
    available: number;
    value: number;
    average_price: number;
    max_price: number;
    min_price: number;
    condition_distribution: Record<string, number>;
    capacity_distribution: Record<string, number>;
    price_segments: InventoryPriceSegment[];
    top_models: InventoryTopModel[];
  };
  sales: {
    total: number;
    revenue: number;
    average_ticket: number;
    top_models: SalesTopModel[];
  };
}

export const api = {
  getInventory: async (): Promise<Phone[]> => {
    const response = await fetch(`${API_URL}/inventory`);
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return response.json();
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  addPhone: async (phone: Omit<Phone, 'id' | 'estado'>): Promise<Phone> => {
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phone),
    });
    if (!response.ok) throw new Error('Failed to add phone');
    return response.json();
  },

  updatePhone: async (id: number, phone: Partial<Phone>): Promise<Phone> => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phone),
    });
    if (!response.ok) throw new Error('Failed to update phone');
    return response.json();
  },

  deletePhone: async (id: number): Promise<Phone> => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete phone');
    return response.json();
  },

  undoLastSale: async (): Promise<Phone> => {
    const response = await fetch(`${API_URL}/undo`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to undo last sale');
    return response.json();
  },
};
