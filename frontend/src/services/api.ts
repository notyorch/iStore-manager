const API_URL = '/api';

export interface Phone {
  id: number;
  modelo: string;
  capacidad: string;
  condicion: string;
  precio: number;
  estado: string;
}

export const api = {
  getInventory: async (): Promise<Phone[]> => {
    const response = await fetch(`${API_URL}/inventory`);
    if (!response.ok) throw new Error('Failed to fetch inventory');
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
