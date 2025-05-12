import { Route, BusType } from './types';

const API_BASE_URL = 'https://transitlk-f4ya5zx3ta-uc.a.run.app/api';

interface CreateRoutePayload {
  number: string;
  name: string;
  busTypes: BusType[];
  locations?: Record<BusType, string[]>;
  fareMatrix?: Record<BusType, number[]>;
}

interface UpdateRoutePayload {
  number?: string;
  name?: string;
  busTypes?: BusType[];
  locations?: Record<BusType, string[]>;
  fareMatrix?: Record<BusType, number[]>;
}

interface SearchFareResponse {
  status: string;
  route: {
    id: string;
    number: string;
    name: string;
  };
  fromCity: string;
  toCity: string;
  results: Record<BusType, number | null>;
}

interface ApiOptions {
  method?: string;
  body?: any;
  requiresAuth?: boolean;
}

export async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const {
    method = 'GET',
    body,
    requiresAuth = false,
  } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication required');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
    throw new Error('API call failed');
  }

  return response.json();
}

// Route-specific API functions
export const routeApi = {
  create: (data: any) => apiCall('/routes', {
    method: 'POST',
    body: data,
    requiresAuth: true,
  }),

  update: (id: string, data: any) => apiCall(`/routes/${id}`, {
    method: 'PATCH',
    body: data,
    requiresAuth: true,
  }),

  delete: (id: string) => apiCall(`/routes/${id}`, {
    method: 'DELETE',
    requiresAuth: true,
  }),

  // Non-authenticated endpoints
  getAll: () => apiCall('/routes'),
  getOne: (id: string) => apiCall(`/routes/${id}`),
  searchFare: (data: any) => apiCall('/routes/search-fare', {
    method: 'POST',
    body: data,
  }),
};

export const api = {
  routes: {
    getAll: async (): Promise<Route[]> => {
      const response = await fetch(`${API_BASE_URL}/routes`);
      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }
      return response.json();
    },

    getList: async () => {
      const response = await fetch(`${API_BASE_URL}/routes/list`);
      if (!response.ok) {
        throw new Error('Failed to fetch routes list');
      }
      return response.json();
    },

    getCities: async (routeId: string) => {
      const response = await fetch(`${API_BASE_URL}/routes/${routeId}/cities`);
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      return response.json();
    },

    searchFare: async (routeId: string, fromCity: string, toCity: string, busTypes?: BusType[]): Promise<SearchFareResponse> => {
      const response = await fetch(`${API_BASE_URL}/routes/search-fare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routeId,
          fromCity,
          toCity,
          busTypes
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search fare');
      }
      return response.json();
    },

    getOne: async (id: string): Promise<Route> => {
      const response = await fetch(`${API_BASE_URL}/routes/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }
      return response.json();
    },

    create: async (data: CreateRoutePayload): Promise<Route> => {
      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create route');
      }
      return response.json();
    },

    update: async (id: string, data: UpdateRoutePayload): Promise<Route> => {
      const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update route');
      }
      return response.json();
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete route');
      }
    },
  },
}; 